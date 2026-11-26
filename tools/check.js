// Project check (`npm run check`): verifies the rules from ARCHITECTURE.md that a
// machine can verify, and tells how to fix each problem it finds.
//
// Rules:
// 1. Every source file (.js, .css, .html) starts with a header comment.
// 2. Parts are isolated: a part imports only its own files. The only exception is
//    the app's pure domain layer (app/src/domain/), which other parts may import —
//    except tools/, which import nothing from app/. Tests may import anything.
// 3. The app imports only relative paths to existing files (no packages, no CDN).
// 4. Layers inside app/src: main.js → ui → data → domain. A layer imports only
//    itself and layers to its right.
// 5. HTML and CSS load only files of their own part, by relative path: <script src>,
//    <link href>, src of media and frames, CSS url() and @import (nothing from other
//    websites, no root paths that break under /setlist/app/).
// 6. Only app/src/ui/html.js writes HTML into the page (innerHTML and similar);
//    everything else renders through its escaping `html` template (ADR 0004).
// 7. The offline file list (FILES in app/sw.js) holds every published file of the
//    app — all files under app/ except sw.js itself and documentation (.md, .txt) —
//    and nothing that does not exist.
// 8. When a file under app/ differs from the base, VERSION in app/sw.js differs too.
//    Base: $CHECK_VERSION_BASE (CI: origin/main on a pull request, HEAD^ on deploy),
//    else origin/main. Skipped with a note when that base is missing locally.
// 9. Views and components (app/src/ui/views/, app/src/ui/components/) are pure:
//    state in, HTML out. They import only ui/html.js, ui/routes.js, other views
//    and components, and the domain layer, and use no browser globals.
// 10. app/src/main.js only wires the layers together: no state (let), no own
//    functions, no event listeners, no rendering and no work with the address.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SOURCE_EXTENSIONS = ['.js', '.css', '.html'];
const SKIP_DIRS = new Set(['.git', '.github', '.claude', 'node_modules', 'docs', 'test-results', 'playwright-report']);
const LAYERS = ['domain', 'data', 'ui', 'main'];
const DOMAIN_DIR = 'app/src/domain/';
const RENDERER = 'app/src/ui/html.js';
const WORKER = 'app/sw.js';
const DEFAULT_BASE = 'origin/main';

/**
 * Returns a problem message when the file does not start with a header comment.
 * @param {string} path repository-relative path with forward slashes
 * @param {string} source file content
 * @returns {string | null}
 */
export function headerProblem(path, source) {
  const lines = source.split('\n').map((line) => line.trim()).filter(Boolean);
  // A shebang or doctype may come before the header comment.
  const first = /^(#!|<!doctype)/i.test(lines[0] ?? '') ? lines[1] : lines[0];
  if (first && /^(\/\/|\/\*|<!--)/.test(first)) return null;
  return `${path}: missing header comment. Start the file with a short comment on what it is for (golden principle 12).`;
}

/**
 * Lists the module specifiers a JavaScript file imports (static, re-exports and dynamic).
 * @param {string} source
 * @returns {string[]}
 */
export function importsOf(source) {
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const pattern = /\b(?:import|export)\s[^'"`;]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;
  return [...code.matchAll(pattern)].map((match) => match[1] ?? match[2] ?? match[3]);
}

/** The layer of a file inside app/src, or null for files outside it. */
export function layerOf(path) {
  if (path === 'app/src/main.js') return 'main';
  const match = /^app\/src\/([^/]+)\//.exec(path);
  return match ? match[1] : null;
}

/**
 * Checks the imports of one JavaScript file against rules 2–4.
 * @param {string} path repository-relative path with forward slashes
 * @param {string} source file content
 * @param {(path: string) => boolean} exists whether a repository-relative file exists
 * @returns {string[]} problem messages
 */
export function importProblems(path, source, exists) {
  const part = path.includes('/') ? path.split('/')[0] : null;
  if (part === null || part === 'tests') return []; // root config files and tests may import anything
  const problems = [];
  const layer = layerOf(path);

  if (part === 'app' && path.startsWith('app/src/') && !LAYERS.includes(layer)) {
    problems.push(`${path}: not in a layer. Put app code in app/src/domain, data or ui (see ARCHITECTURE.md, "Layers of the app").`);
  }

  for (const specifier of importsOf(source)) {
    const where = `${path}: imports '${specifier}'`;
    if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
      if (part === 'app') {
        problems.push(`${where} — the app has no runtime dependencies and loads nothing from other websites. Import our own files with a relative path ('./x.js').`);
      }
      continue; // packages and Node built-ins are fine outside the app
    }

    const target = posix.normalize(posix.join(posix.dirname(path), specifier));
    if (!exists(target)) {
      problems.push(`${where}, but ${target} does not exist. Fix the path; browsers need the full file name including '.js'.`);
      continue;
    }

    const targetPart = target.split('/')[0];
    if (targetPart !== part) {
      const domainAllowed = part !== 'tools' && target.startsWith(DOMAIN_DIR);
      if (!domainAllowed) {
        problems.push(`${where} from another part (${targetPart}/). Parts are isolated; only ${DOMAIN_DIR} may be shared, and tools/ import nothing from app/ (see ARCHITECTURE.md, "Repository layout").`);
      }
      continue;
    }

    const targetLayer = layerOf(target);
    if (layer && targetLayer && LAYERS.indexOf(targetLayer) > LAYERS.indexOf(layer)) {
      const allowed = LAYERS.slice(0, LAYERS.indexOf(layer) + 1).filter((name) => name !== 'main').join(', ');
      problems.push(`${where} from the ${targetLayer} layer. The ${layer} layer may import only: ${allowed}. Move the shared code to a lower layer or pass it in from the caller (see ARCHITECTURE.md, "Layers of the app").`);
    }
  }
  return problems;
}

/**
 * Lists the files an HTML or CSS file loads: <script src>, <link href> (except
 * rel=canonical, which loads nothing), src of <img>, <source>, <video>, <audio>,
 * <iframe> and <embed>, CSS url() and @import (in .css files and <style> blocks).
 * Inline data: URLs and fragment-only references are left out.
 * @param {string} path repository-relative path ending in .html or .css
 * @param {string} source file content
 * @returns {string[]}
 */
export function assetReferencesOf(path, source) {
  const references = [];
  const isHtml = path.endsWith('.html');
  // In HTML, only inline <style> blocks hold CSS; comments are left out.
  let css = source;
  if (isHtml) {
    const html = source.replace(/<!--[\s\S]*?-->/g, '');
    css = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1]).join('\n');
    for (const [tag, name] of html.matchAll(/<(script|link|img|source|video|audio|iframe|embed)\b[^>]*>/gi)) {
      if (/\brel\s*=\s*["']?canonical\b/i.test(tag)) continue;
      const attribute = name.toLowerCase() === 'link' ? 'href' : 'src';
      const match = new RegExp(`\\b${attribute}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(tag);
      if (match) references.push(match[1] ?? match[2] ?? match[3]);
    }
  }
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)\s]*))\s*\)|@import\s+(?:"([^"]*)"|'([^']*)')/gi)) {
    references.push(match.slice(1).find((value) => value !== undefined));
  }
  return references.filter((reference) => reference && !reference.startsWith('data:') && !reference.startsWith('#'));
}

/**
 * Checks the files an HTML or CSS file loads against rule 5.
 * @param {string} path repository-relative path with forward slashes
 * @param {string} source file content
 * @param {(path: string) => boolean} exists whether a repository-relative file exists
 * @returns {string[]} problem messages
 */
export function assetProblems(path, source, exists) {
  const part = path.split('/')[0];
  if (!['app', 'site'].includes(part)) return [];
  const problems = [];
  for (const reference of assetReferencesOf(path, source)) {
    const where = `${path}: loads '${reference}'`;
    if (/^([a-z][a-z0-9+.-]*:|\/)/i.test(reference)) {
      problems.push(`${where} — load only the part's own files by relative path ('styles/x.css', '../assets/x.woff2'). Nothing comes from other websites, and a root path ('/x') breaks under /setlist/app/ (see ARCHITECTURE.md, "Technical constraints").`);
      continue;
    }
    const target = posix.normalize(posix.join(posix.dirname(path), reference.split(/[?#]/)[0]));
    if (target.split('/')[0] !== part) {
      problems.push(`${where} from another part. Parts are isolated: copy the file into ${part}/ (see ARCHITECTURE.md, "Repository layout").`);
    } else if (!exists(target)) {
      problems.push(`${where}, but ${target} does not exist. Fix the path (relative to ${path}).`);
    }
  }
  return problems;
}

/**
 * Checks rule 6: app code other than the renderer must not write HTML strings into
 * the page, because they bypass escaping.
 * @param {string} path repository-relative path with forward slashes
 * @param {string} source file content
 * @returns {string[]} problem messages
 */
export function rawHtmlProblems(path, source) {
  if (!path.startsWith('app/') || !path.endsWith('.js') || path === RENDERER) return [];
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const pattern = /\.(?:inner|outer)HTML\s*\+?=(?!=)|\b(?:insertAdjacentHTML|createContextualFragment|setHTMLUnsafe|parseHTMLUnsafe)\b|\bdocument\.write(?:ln)?\b/g;
  return [...new Set(code.match(pattern) ?? [])].map((found) =>
    `${path}: writes HTML directly ('${found.trim()}'). Build it with the html\`…\` template and insert it with render() from ${RENDERER}, which escape values (see ARCHITECTURE.md, "Layers of the app").`);
}

const PURE_UI_DIRS = ['app/src/ui/views/', 'app/src/ui/components/'];
const PURE_UI_IMPORTS = ['app/src/ui/html.js', 'app/src/ui/routes.js', ...PURE_UI_DIRS, DOMAIN_DIR];
const BROWSER_GLOBALS = /\b(?:window|document|location|history|navigator|localStorage|sessionStorage|indexedDB|fetch)\b/g;

/**
 * Checks rule 9: views and components only turn state into HTML. Loading data,
 * reacting to events and other side effects belong to the screens (ui/screens/).
 * @param {string} path repository-relative path with forward slashes
 * @param {string} source file content
 * @returns {string[]} problem messages
 */
export function pureViewProblems(path, source) {
  if (!path.endsWith('.js') || !PURE_UI_DIRS.some((dir) => path.startsWith(dir))) return [];
  const hint = 'Views and components are pure: state in, HTML out. Do loading, events and other side effects in a screen (app/src/ui/screens/) and pass the result in (see ARCHITECTURE.md, "Screens and routing").';
  const problems = [];
  for (const specifier of importsOf(source)) {
    const target = posix.normalize(posix.join(posix.dirname(path), specifier));
    if (!PURE_UI_IMPORTS.some((allowed) => target === allowed || (allowed.endsWith('/') && target.startsWith(allowed)))) {
      problems.push(`${path}: imports '${specifier}'. ${hint}`);
    }
  }
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/import\([^)]*\)/g, '');
  for (const name of new Set(code.match(BROWSER_GLOBALS) ?? [])) {
    problems.push(`${path}: uses '${name}'. ${hint}`);
  }
  return problems;
}

const MAIN = 'app/src/main.js';
const MAIN_FORBIDDEN = /\blet\b|\bfunction\b|\baddEventListener\b|\bdelegate\(|\bonKeys\(|\brender\(|\bhistory\b|\blocation\b/g;

/**
 * Checks rule 10: start-up code stays small. Screen state, actions and routing
 * belong to the screens and the router (ARCHITECTURE.md, "Screens and routing").
 * @param {string} path repository-relative path with forward slashes
 * @param {string} source file content
 * @returns {string[]} problem messages
 */
export function mainProblems(path, source) {
  if (path !== MAIN) return [];
  const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  return [...new Set(code.match(MAIN_FORBIDDEN) ?? [])].map((found) =>
    `${MAIN}: uses '${found.replace('(', '')}'. main.js only wires the layers together: create the screens, start the router and the service worker. Put state, actions, rendering and work with the address into a screen (app/src/ui/screens/) or the router (see ARCHITECTURE.md, "Screens and routing").`);
}

/** Whether an app file is documentation, which is published but not stored offline. */
export function isDocumentation(path) {
  return /\.(md|txt)$/i.test(path);
}

/**
 * Reads the offline file list (the FILES array) from the service worker.
 * @param {string} source content of app/sw.js
 * @returns {string[] | null} paths relative to app/, or null when there is no list
 */
export function offlineFilesOf(source) {
  const list = /\bconst\s+FILES\s*=\s*\[([\s\S]*?)\]/.exec(source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''));
  return list ? [...list[1].matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1]) : null;
}

/**
 * Reads VERSION from the service worker.
 * @param {string} source content of app/sw.js
 * @returns {string | null}
 */
export function versionOf(source) {
  return /\bconst\s+VERSION\s*=\s*['"]([^'"]+)['"]/.exec(source)?.[1] ?? null;
}

/**
 * Checks rule 7: the offline list matches the published files of the app.
 * @param {string[] | null} listed the offline list, relative to app/
 * @param {string[]} appFiles repository-relative paths of all files under app/
 * @returns {string[]} problem messages
 */
export function offlineListProblems(listed, appFiles) {
  if (!listed) return [`${WORKER}: no offline file list found. Keep the list as 'const FILES = [ ... ];' (see ARCHITECTURE.md, "Offline and updates").`];
  const expected = appFiles.filter((path) => path !== WORKER && !isDocumentation(path)).map((path) => path.slice('app/'.length));
  const listedSet = new Set(listed);
  const expectedSet = new Set(expected);
  return [
    ...expected.filter((file) => !listedSet.has(file)).map((file) =>
      `${WORKER}: app/${file} is missing from the offline file list (FILES). Add '${file}' there and change VERSION, or the app breaks offline (see ARCHITECTURE.md, "Offline and updates").`),
    ...[...new Set(listed)].filter((file) => !expectedSet.has(file)).map((file) =>
      `${WORKER}: the offline file list (FILES) names '${file}', which is not a published file of the app (app/${file} does not exist, or it is sw.js or documentation). Remove it or fix the path; one missing file fails the whole install.`),
  ];
}

/**
 * Checks rule 8: a change under app/ comes with a new VERSION.
 * @param {string[]} changed repository-relative paths that differ from the base
 * @param {string | null} version VERSION now
 * @param {string | null} baseVersion VERSION in the base
 * @param {string} base the git revision compared against
 * @returns {string[]} problem messages
 */
export function versionProblems(changed, version, baseVersion, base) {
  const appChanges = changed.filter((path) => path.startsWith('app/'));
  if (!appChanges.length || version !== baseVersion) return [];
  const shown = appChanges.slice(0, 5).join(', ') + (appChanges.length > 5 ? ', …' : '');
  return [`${WORKER}: files under app/ changed against ${base} (${shown}), but VERSION is still '${version}'. Change VERSION in ${WORKER} (YYYY.MM.DD, .2, .3 for more releases on one day), otherwise installed apps never get the change (see ARCHITECTURE.md, "Offline and updates").`];
}

/** Runs git in the repository and returns its output, or null when it fails. */
function git(...args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

/** Rule 8 against git: returns problems, or a note when the rule is skipped. */
function versionCheck() {
  const base = process.env.CHECK_VERSION_BASE || DEFAULT_BASE;
  const required = Boolean(process.env.CHECK_VERSION_BASE);
  if (git('rev-parse', '--verify', '--quiet', `${base}^{commit}`) === null) {
    if (required) return { problems: [`check: base ${base} for the version rule (CHECK_VERSION_BASE) is missing. Fetch it (e.g. 'git fetch origin main') or fix the workflow.`] };
    return { note: `check: version rule skipped — ${base} is missing (run 'git fetch origin main' to check it).` };
  }
  // Compares the base with the working tree, so uncommitted edits count too.
  const diff = git('diff', '--name-only', base, '--', 'app/');
  const untracked = git('ls-files', '--others', '--exclude-standard', '--', 'app/');
  if (diff === null || untracked === null) return { problems: [`check: could not compare app/ with ${base} (git diff failed).`] };
  const changed = [...diff.split('\n'), ...untracked.split('\n')].filter(Boolean);
  const baseSource = git('show', `${base}:${WORKER}`);
  const version = versionOf(readFileSync(join(ROOT, WORKER), 'utf8'));
  return { problems: versionProblems(changed, version, baseSource === null ? null : versionOf(baseSource), base) };
}

/** Repository-relative paths of all files under app/. */
function appFiles(dir = join(ROOT, 'app')) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? appFiles(full) : [relative(ROOT, full).split('\\').join('/')];
  });
}

/** Repository-relative paths (forward slashes) of all source files to check. */
function sourceFiles(dir = ROOT) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return SKIP_DIRS.has(entry.name) ? [] : sourceFiles(full);
    const path = relative(ROOT, full).split('\\').join('/');
    return SOURCE_EXTENSIONS.some((ext) => path.endsWith(ext)) ? [path] : [];
  });
}

function main() {
  // Only files count: browsers do not resolve a folder to its index file.
  const exists = (path) => statSync(join(ROOT, path), { throwIfNoEntry: false })?.isFile() ?? false;
  const files = sourceFiles();
  const problems = files.flatMap((path) => {
    const source = readFileSync(join(ROOT, path), 'utf8');
    const header = headerProblem(path, source);
    const references = path.endsWith('.js') ? importProblems(path, source, exists) : assetProblems(path, source, exists);
    return [...(header ? [header] : []), ...references, ...rawHtmlProblems(path, source), ...pureViewProblems(path, source), ...mainProblems(path, source)];
  });
  problems.push(...offlineListProblems(offlineFilesOf(readFileSync(join(ROOT, WORKER), 'utf8')), appFiles()));
  const version = versionCheck();
  problems.push(...(version.problems ?? []));
  if (version.note) console.log(version.note);

  if (problems.length) {
    console.error(problems.join('\n'));
    console.error(`\ncheck: ${problems.length} problem(s) in ${files.length} files.`);
    process.exit(1);
  }
  console.log(`check: ${files.length} files OK.`);
}

// Run only when started as a script, not when imported by tests. Paths are compared
// case-insensitively because Windows may report the drive letter in either case.
const isScript = resolve(process.argv[1] ?? '').toLowerCase() === fileURLToPath(import.meta.url).toLowerCase();
if (isScript) main();
