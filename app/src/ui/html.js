// Safe rendering (ADR 0004): views build their HTML with the `html` tagged template,
// which escapes every interpolated value, so song data and user input can never turn
// into markup or script. `render` is the only place where the app writes HTML into
// the page (the project check enforces this).
//
// Where a value lands decides what is allowed:
// - between tags: text (escaped), nested `html` templates and arrays of them (lists);
//   null, undefined and false render nothing;
// - inside a quoted attribute value: text (escaped). In URL attributes (href, src, …)
//   a value that starts the URL and has a scheme other than http, https, mailto or
//   tel (e.g. `javascript:`) is replaced by '#'. A value may also follow a fixed
//   start that already decides the scheme ('/songs/${id}', '#song-${id}',
//   'mailto:${address}');
// - inside a tag but outside a value: only a bare attribute name such as 'disabled'
//   (or nothing), for boolean attributes, standing on its own between spaces.
// Everything else is a programming mistake and throws with a hint how to fix it:
// unquoted attribute values, values in tag or attribute names, values in event
// handler attributes (on…) or srcdoc, values in SVG animations, values inside
// <script> or <style>, and URLs whose start is pieced together.

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const URL_ATTRIBUTES = new Set(['href', 'src', 'action', 'formaction', 'poster', 'data', 'xlink:href']);
const SAFE_SCHEMES = new Set(['http', 'https', 'mailto', 'tel']);
// SVG animations can set any attribute, href included, from their own attributes.
const ANIMATION_TAG = /^<(animate|animatemotion|animatetransform|set)\b/i;

// Where the template is while it is read: the states of a tiny HTML tokenizer that
// follows only what matters for escaping.
const TEXT = 'text';
const TAG = 'tag';
const ATTRIBUTE = 'attribute';
const COMMENT = 'comment';
const RAW_TEXT = 'raw text'; // inside <script> or <style>

/** HTML produced by the `html` template: safe to insert into the page as it is. */
class SafeHtml {
  /** @param {string} value */
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

/**
 * Escapes text for use between tags or inside a quoted attribute value.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ENTITIES[char]);
}

/**
 * Returns the URL unchanged when it is relative or uses a safe scheme, '#' otherwise.
 * @param {unknown} value
 * @returns {string}
 */
export function safeUrl(value) {
  const url = String(value);
  const scheme = /^([a-z][a-z0-9+.-]*):/.exec(stripInvisible(url).toLowerCase())?.[1];
  return scheme === undefined || SAFE_SCHEMES.has(scheme) ? url : '#';
}

/**
 * Tagged template that builds escaped HTML: html`<li>${song.title}</li>`.
 * @param {TemplateStringsArray} strings
 * @param {...unknown} values
 * @returns {SafeHtml}
 */
export function html(strings, ...values) {
  const reader = new TemplateReader();
  let out = '';
  strings.forEach((chunk, index) => {
    reader.read(chunk);
    out += chunk;
    if (index < values.length) out += reader.place(values[index], strings[index + 1]);
  });
  return new SafeHtml(out);
}

/**
 * Replaces the content of an element with a template built by `html`.
 * Plain strings are refused, so unescaped HTML cannot reach the page by mistake.
 * @param {Element} element
 * @param {SafeHtml} template
 */
export function render(element, template) {
  if (!(template instanceof SafeHtml)) {
    throw new TypeError('render() takes only templates built with html`…`. Build the markup with the html tag instead of a string.');
  }
  element.innerHTML = template.value;
}

/**
 * Browsers skip control characters and spaces around a URL's scheme, and tabs and
 * line breaks anywhere in it ('java\tscript:'), so they are removed before any test.
 */
function stripInvisible(text) {
  return text.replace(/[\x00-\x20]/g, '');
}

/** Follows the static parts of one template to know where each value lands. */
class TemplateReader {
  constructor() {
    this.state = TEXT;
    this.tag = ''; // text of the current tag so far, e.g. '<a class="" href='
    this.attribute = ''; // name of the attribute whose quoted value we are in
    this.quote = '';
    this.url = ''; // the attribute value so far: static text and placed values
    this.rawEnd = ''; // the end tag that closes <script> or <style>
    this.endsWithLessThan = false;
  }

  /** @param {string} chunk a static part of the template */
  read(chunk) {
    let i = 0;
    while (i < chunk.length) {
      const char = chunk[i];
      if (this.state === TEXT) {
        if (chunk.startsWith('<!--', i)) {
          this.state = COMMENT;
          i += 4;
          continue;
        }
        // Like browsers: '<' opens a tag only before a letter, '/', '!' or '?'.
        if (char === '<' && /[a-z/!?]/i.test(chunk[i + 1] ?? '')) {
          this.state = TAG;
          this.tag = '<';
        }
      } else if (this.state === COMMENT) {
        if (chunk.startsWith('-->', i)) {
          this.state = TEXT;
          i += 3;
          continue;
        }
      } else if (this.state === TAG) {
        if (char === '"' || char === "'") {
          this.state = ATTRIBUTE;
          this.quote = char;
          this.attribute = /([^\s"'>/=]+)\s*=\s*$/.exec(this.tag)?.[1].toLowerCase() ?? '';
          this.url = '';
        } else if (char === '>') {
          const name = /^<(script|style)\b/i.exec(this.tag)?.[1].toLowerCase();
          this.state = name ? RAW_TEXT : TEXT;
          this.rawEnd = name ? `</${name}` : '';
        } else {
          this.tag += char;
        }
      } else if (this.state === ATTRIBUTE) {
        if (char === this.quote) {
          this.closeAttribute();
        } else {
          this.url += char;
        }
      } else if (this.state === RAW_TEXT) {
        if (chunk.slice(i, i + this.rawEnd.length).toLowerCase() === this.rawEnd) {
          this.state = TAG;
          this.tag = '<';
          i += 1;
          continue;
        }
      }
      i += 1;
    }
    this.endsWithLessThan = this.state === TEXT && chunk.endsWith('<');
  }

  closeAttribute() {
    // Static text after a value could still complete a dangerous scheme (${'java'}script:).
    if (URL_ATTRIBUTES.has(this.attribute) && safeUrl(this.url) !== this.url) {
      fail(`the ${this.attribute} URL '${this.url}' has an unsafe scheme. Use http, https, mailto, tel or a relative URL.`);
    }
    this.state = TAG;
    this.tag += '"" '; // stands for the closed value, so the tag text no longer ends in '='
  }

  /**
   * Returns the value as HTML for the current place in the template.
   * @param {unknown} value
   * @param {string} nextChunk the static part right after the value
   * @returns {string}
   */
  place(value, nextChunk) {
    switch (this.state) {
      case TEXT:
        if (this.endsWithLessThan) fail('a tag name cannot come from a value. Write the tag in the template, e.g. html`<li>…</li>`.');
        return content(value);
      case COMMENT:
        return content(value);
      case TAG:
        return this.placeInTag(value, nextChunk);
      case ATTRIBUTE:
        return this.placeInAttribute(value);
      default:
        return fail('a value cannot go inside <script> or <style>. Keep scripts in .js modules and styles in .css files.');
    }
  }

  placeInTag(value, nextChunk) {
    if (/=\s*$/.test(this.tag)) fail('attribute values must be quoted. Write attr="${value}".');
    // The value must stand on its own: glued to other text it would extend a tag
    // name (<scr${'ipt'}>) or name an attribute that skips the checks (${'onclick'}="…").
    if (!/\s$/.test(this.tag) || !/^(\s|\/|>|$)/.test(nextChunk)) {
      fail("a value in a tag can only be a whole bare attribute name between spaces, e.g. <input ${done ? 'checked' : ''}>. Write tag and attribute names in the template.");
    }
    if (value === null || value === undefined || value === false || value === '') return '';
    if (typeof value === 'string' && /^[a-z][a-z0-9-]*$/i.test(value)) {
      this.tag += value; // a value right after this one would glue onto this name
      return value;
    }
    return fail("inside a tag a value can only be a bare attribute name such as 'disabled'. Put other values inside a quoted attribute: attr=\"${value}\".");
  }

  placeInAttribute(value) {
    const name = this.attribute;
    if (ANIMATION_TAG.test(this.tag)) {
      fail('a value cannot go into an SVG animation, which can change any attribute. Write it in the template.');
    }
    if (name.startsWith('on') || name === 'srcdoc') {
      fail(`a value cannot go into the ${name} attribute. Use data-action and a delegated event (ui/events.js) instead of inline handlers.`);
    }
    if (Array.isArray(value) || value instanceof SafeHtml) {
      fail(`the ${name || 'attribute'} value must be text, not a template or a list. Join a list into a string first.`);
    }
    if (value === null || value === undefined || value === false) return '';

    const start = stripInvisible(this.url);
    // Outside URL attributes, or after a fixed start that decides the scheme
    // (one of ': / ? #'), escaping is enough.
    if (!URL_ATTRIBUTES.has(name) || /[:/?#]/.test(start)) {
      this.url += String(value);
      return escapeHtml(value);
    }
    // The value starts the URL. Its scheme must come from this one value, or it
    // could be pieced together from harmless-looking parts ('java' + 'script:').
    if (start !== '') {
      fail(`the start of a ${name} URL must come from one value or from a fixed part such as '/', '#' or 'https:'. Join the parts into one string first.`);
    }
    const url = safeUrl(value);
    this.url += url;
    return escapeHtml(url);
  }
}

/** Renders a value placed between tags: text is escaped, templates and lists are kept. */
function content(value) {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(content).join('');
  return escapeHtml(value);
}

/** @returns {never} */
function fail(problem) {
  throw new Error(`html\`…\`: ${problem}`);
}
