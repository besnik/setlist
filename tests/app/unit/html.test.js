// Safe rendering (ADR 0004, task T-016): the html tagged template escapes every value,
// keeps nested templates and lists, blocks javascript: URLs and refuses places where
// a value could become markup or script.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, html, render, safeUrl } from '../../../app/src/ui/html.js';

const text = (template) => String(template);
const attack = `<img src=x onerror="alert('x')">&`;

// Every value between tags is escaped, so song data can never become markup.
test('text values are escaped', () => {
  assert.equal(text(html`<p>${attack}</p>`), '<p>&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;&amp;</p>');
  assert.equal(text(html`<p>${42} ${0}</p>`), '<p>42 0</p>');
  assert.equal(escapeHtml(`a"b'c`), 'a&quot;b&#39;c');
});

// null, undefined and false render nothing, so `${cond && html`…`}` works.
test('empty values render nothing', () => {
  assert.equal(text(html`<p>${null}${undefined}${false}</p>`), '<p></p>');
  assert.equal(text(html`<p class="${null}"></p>`), '<p class=""></p>');
});

// Nested templates and lists of them are kept as markup; strings inside lists are escaped.
test('nested templates and lists', () => {
  const items = ['A & B', '<b>'].map((title) => html`<li>${title}</li>`);
  assert.equal(text(html`<ul>${items}</ul>`), '<ul><li>A &amp; B</li><li>&lt;b&gt;</li></ul>');
  assert.equal(text(html`<p>${['<i>', html`<i>x</i>`]}</p>`), '<p>&lt;i&gt;<i>x</i></p>');
  assert.equal(text(html`<ul>${[]}</ul>`), '<ul></ul>');
});

// Values in quoted attributes cannot close the quote.
test('attribute values are escaped', () => {
  assert.equal(text(html`<input value="${`" autofocus onfocus="x`}">`), '<input value="&quot; autofocus onfocus=&quot;x">');
  assert.equal(text(html`<input value='${`' onfocus='x`}'>`), `<input value='&#39; onfocus=&#39;x'>`);
  assert.equal(text(html`<li class="song ${'a'} ${'b'}" data-id="${7}"></li>`), '<li class="song a b" data-id="7"></li>');
});

// No javascript: URLs: unsafe schemes in URL attributes become '#', also when disguised.
test('unsafe URLs are blocked', () => {
  for (const url of ['javascript:alert(1)', ' JavaScript:alert(1)', 'java\tscript:alert(1)', '\u0001javascript:x', 'data:text/html,x', 'vbscript:x']) {
    assert.equal(text(html`<a href="${url}">x</a>`), '<a href="#">x</a>', url);
  }
  for (const url of ['https://example.com/?a=1&b=2', 'http://x', 'mailto:a@b.c', 'tel:+421', '#songs', 'songs/1', '/x', '//example.com']) {
    assert.equal(safeUrl(url), url);
  }
  assert.equal(text(html`<a href="${'https://x/?a=1&b=2'}">`), '<a href="https://x/?a=1&amp;b=2">');
  assert.equal(text(html`<img src="${'javascript:x'}">`), '<img src="#">');
  // After a static start the scheme is fixed, so the value is only escaped.
  assert.equal(text(html`<a href="#song-${'javascript:x'}">`), '<a href="#song-javascript:x">');
});

// A URL split into pieces could hide its scheme, so its start must be one value.
test('the start of a URL must be one value', () => {
  assert.throws(() => html`<a href="${'java'}${'script:alert(1)'}">`, /must come from one value/);
});

// Places where escaping is not enough are refused with a hint.
test('unsafe places for values throw', () => {
  assert.throws(() => html`<a href=${'x'}>`, /must be quoted/);
  assert.throws(() => html`<${'script'}>`, /tag name/);
  assert.throws(() => html`<div ${'onclick=alert(1)'}>`, /bare attribute name/);
  assert.throws(() => html`<button onclick="${'go()'}">`, /data-action/);
  assert.throws(() => html`<iframe srcdoc="${'<b>'}">`, /srcdoc/);
  assert.throws(() => html`<script>const a = ${'1'};</script>`, /<script> or <style>/);
  assert.throws(() => html`<style>p { color: ${'red'} }</style>`, /<script> or <style>/);
  assert.throws(() => html`<p class="${html`<b>`}">`, /must be text/);
  assert.throws(() => html`<p class="${['a', 'b']}">`, /must be text/);
});

// Boolean attributes can be switched on and off by a value.
test('boolean attributes', () => {
  assert.equal(text(html`<button ${'disabled'}>`), '<button disabled>');
  assert.equal(text(html`<button ${false}>`), '<button >');
  assert.equal(text(html`<input ${'checked'} type="checkbox">`), '<input checked type="checkbox">');
});

// The template keeps track of tags across static parts, quotes in text and comments.
test('context is followed across the template', () => {
  assert.equal(text(html`<p>It's ${'<b>'} "quoted"</p><a href="${'javascript:x'}">`), `<p>It's &lt;b&gt; "quoted"</p><a href="#">`);
  assert.equal(text(html`<p>1 < 2 ${'<b>'}</p>`), '<p>1 < 2 &lt;b&gt;</p>');
  assert.equal(text(html`<!-- "x' --><p>${'<b>'}</p>`), '<!-- "x\' --><p>&lt;b&gt;</p>');
  assert.equal(text(html`<style>p{}</style><p>${'<b>'}</p>`), '<style>p{}</style><p>&lt;b&gt;</p>');
  assert.equal(text(html`<a title="a>b" href="${'javascript:x'}">`), '<a title="a>b" href="#">');
});

// render() writes only templates, never plain strings.
test('render accepts only html templates', () => {
  const element = { innerHTML: '' };
  render(element, html`<p>${'<b>'}</p>`);
  assert.equal(element.innerHTML, '<p>&lt;b&gt;</p>');
  assert.throws(() => render(element, '<b>x</b>'), /only templates built with html/);
});
