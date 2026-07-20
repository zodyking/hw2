/**
 * Theme definitions — color palettes for light and dark modes.
 * Returns a flat map of CSS property values.
 */

import { TOKENS, LIGHT_TOKENS } from './tokens.js';

/**
 * Dark theme base palette. This is the default.
 * @returns {Record<string, string>}
 */
export function darkBase() {
  return { ...TOKENS };
}

/**
 * Light theme base palette.
 * @returns {Record<string, string>}
 */
export function lightBase() {
  return { ...LIGHT_TOKENS };
}

/**
 * Resolve a complete theme given a mode and optional per-token overrides.
 * @param {'dark'|'light'} mode
 * @param {Record<string,string>} [overrides]
 * @returns {Record<string,string>}
 */
export function resolveTheme(mode = 'dark', overrides = {}) {
  const base = mode === 'light' ? lightBase() : darkBase();
  return { ...base, ...overrides };
}

/**
 * List of all customizable tokens exposed in the UI.
 * Each entry includes the key, a human-readable label, and category.
 */
export const CUSTOMIZABLE_TOKENS = [
  { key: '--hw-accent', label: 'Accent Color', category: 'Color' },
  { key: '--hw-bg', label: 'Background', category: 'Background' },
  { key: '--hw-surface', label: 'Surface', category: 'Background' },
  { key: '--hw-text', label: 'Text', category: 'Text' },
  { key: '--hw-muted', label: 'Secondary Text', category: 'Text' },
  { key: '--hw-border', label: 'Border', category: 'Background' },
  { key: '--hw-danger', label: 'Danger', category: 'Status' },
  { key: '--hw-warning', label: 'Warning', category: 'Status' },
  { key: '--hw-success', label: 'Success', category: 'Status' },
];
