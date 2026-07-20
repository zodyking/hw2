/**
 * Render utilities — tagged template helpers, sanitization, safe DOM ops.
 */

/**
 * Create a template element from an HTML string.
 * @param {string} html
 * @returns {HTMLTemplateElement}
 */
export function htmlToTemplate(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html.trim();
  return tpl;
}

/**
 * Render an HTML string into a DocumentFragment.
 * Use this for trusted template output.
 * @param {string} html
 * @returns {DocumentFragment}
 */
export function render(html) {
  const tpl = htmlToTemplate(html);
  return tpl.content.cloneNode(true);
}

/**
 * Tagged template literal that builds HTML from string parts.
 * Example: html`<div>${value}</div>`
 * @param {TemplateStringsArray} strings
 * @param  {...any} values
 * @returns {string}
 */
export function html(strings, ...values) {
  let result = '';
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      const v = values[i];
      if (Array.isArray(v)) {
        result += v.join('');
      } else if (v != null) {
        result += v;
      }
    }
  }
  return result;
}

/**
 * Wrap a string with a class-names helper.
 * @param  {...any} args Strings, arrays, or falsy values
 * @returns {string}
 */
export function cls(...args) {
  const names = [];
  for (const a of args) {
    if (!a) continue;
    if (Array.isArray(a)) {
      names.push(...a.filter(Boolean));
    } else if (typeof a === 'object') {
      for (const [k, v] of Object.entries(a)) {
        if (v) names.push(k);
      }
    } else {
      names.push(a);
    }
  }
  return names.join(' ');
}

/**
 * Create an element with attributes and children.
 * @param {string} tag
 * @param {object} [attrs]
 * @param {string|Node|(string|Node)[]} [children]
 * @returns {HTMLElement}
 */
export function el(tag, attrs = {}, children = []) {
  const element = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue;
    if (k === 'class') element.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(element.style, v);
    else if (k.startsWith('on') && typeof v === 'function') {
      element.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'dataset' && typeof v === 'object') {
      Object.assign(element.dataset, v);
    } else {
      element.setAttribute(k, v);
    }
  }
  const kids = Array.isArray(children) ? children : [children];
  for (const kid of kids) {
    if (kid == null) continue;
    if (typeof kid === 'string') element.append(document.createTextNode(kid));
    else element.append(kid);
  }
  return element;
}

/**
 * Query a single element within a root (Shadow DOM safe).
 * @param {Element} root
 * @param {string} selector
 * @returns {Element|null}
 */
export function qs(root, selector) {
  return root.querySelector(selector);
}

/**
 * Query all matching elements within a root.
 * @param {Element} root
 * @param {string} selector
 * @returns {Element[]}
 */
export function qsa(root, selector) {
  return Array.from(root.querySelectorAll(selector));
}

/**
 * Clear all children of an element.
 * @param {Element} el
 */
export function clear(el) {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}
