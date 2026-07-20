/**
 * Theme engine — applies theme tokens to the panel host element.
 * Fully unlocked: supports light/dark toggle and per-token color overrides.
 */

import { resolveTheme } from './themes.js';

/**
 * Apply a resolved theme to a host element via CSS custom properties.
 * @param {HTMLElement} host The panel host element (this)
 * @param {Record<string,string>} theme The resolved theme tokens
 */
export function applyTheme(host, theme) {
  if (!host || !host.style) return;
  for (const [prop, value] of Object.entries(theme)) {
    host.style.setProperty(prop, value);
  }
  // Set the data attribute so CSS can target light/dark specifically
  host.setAttribute('data-hw-theme', theme['--hw-bg'] === '#f5f5f5' ? 'light' : 'dark');
}

/**
 * Convenience: apply theme directly from mode + overrides.
 * @param {HTMLElement} host
 * @param {'dark'|'light'} mode
 * @param {Record<string,string>} [overrides]
 */
export function applyThemeMode(host, mode, overrides = {}) {
  const theme = resolveTheme(mode, overrides);
  applyTheme(host, theme);
  return theme;
}

/**
 * Compute the effective theme (with overrides applied).
 * Useful for reading current chart colors, etc.
 * @param {'dark'|'light'} mode
 * @param {Record<string,string>} [overrides]
 */
export function getThemeColors(mode, overrides = {}) {
  return resolveTheme(mode, overrides);
}

/**
 * Get a chart-friendly palette from the current theme.
 * @param {'dark'|'light'} mode
 * @param {Record<string,string>} [overrides]
 */
export function getChartColors(mode, overrides = {}) {
  const theme = resolveTheme(mode, overrides);
  return {
    bg: theme['--hw-bg'],
    surface: theme['--hw-surface'],
    text: theme['--hw-text'],
    muted: theme['--hw-muted'],
    accent: theme['--hw-accent'],
    danger: theme['--hw-danger'],
    warning: theme['--hw-warning'],
    success: theme['--hw-success'],
  };
}

/**
 * Determine if the current theme is dark.
 * @param {'dark'|'light'} mode
 */
export function isDark(mode) {
  return mode !== 'light';
}
