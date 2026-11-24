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

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SOURCE_EXTENSIONS = ['.js', '.css', '.html'];
const SKIP_DIRS = new Set(['.git', '.github', '.claude', 'node_modules', 'docs', 'test-results', 'playwright-report']);
const LAYERS = ['domain', 'data', 'ui', 'main'];
const DOMAIN_DIR = 'app/src/domain/';

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
    return [...(header ? [header] : []), ...(path.endsWith('.js') ? importProblems(path, source, exists) : [])];
  });

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
