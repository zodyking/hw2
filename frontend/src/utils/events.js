/**
 * Event utilities — debounce, throttle, safe listener helpers.
 */

/**
 * Create a debounced version of a function.
 * @param {Function} fn
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(fn, wait = 200) {
  let timer = null;
  const debounced = (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, wait);
  };
  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  return debounced;
}

/**
 * Create a throttled version of a function.
 * Ensures fn is called at most once per interval.
 * @param {Function} fn
 * @param {number} limit
 * @returns {Function}
 */
export function throttle(fn, limit = 100) {
  let inThrottle = false;
  let lastArgs = null;
  const throttled = (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
  throttled.cancel = () => {
    inThrottle = false;
    lastArgs = null;
  };
  return throttled;
}

/**
 * Run a callback on the next animation frame.
 * @param {Function} fn
 * @returns {number} request id (for cancellation)
 */
export function raf(fn) {
  return requestAnimationFrame(fn);
}

/**
 * Add an event listener and return a cleanup function.
 * @param {EventTarget} target
 * @param {string} type
 * @param {EventListener} handler
 * @param {object|boolean} [options]
 * @returns {Function} cleanup
 */
export function on(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
}

/**
 * Listen for a custom event once, then clean up.
 * @param {EventTarget} target
 * @param {string} type
 * @param {EventListener} handler
 */
export function once(target, type, handler) {
  const wrap = (e) => {
    handler(e);
    target.removeEventListener(type, wrap);
  };
  target.addEventListener(type, wrap);
}

/**
 * Listen for media query changes.
 * @param {string} query e.g. "(max-width: 768px)"
 * @param {Function} callback receives boolean (matches)
 * @returns {Function} cleanup
 */
export function onMediaQuery(query, callback) {
  const mql = window.matchMedia(query);
  callback(mql.matches);
  const handler = (e) => callback(e.matches);
  mql.addEventListener('change', handler);
  return () => mql.removeEventListener('change', handler);
}

/**
 * Detect if the user prefers reduced motion.
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Detect if touch is the primary input.
 * @returns {boolean}
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
