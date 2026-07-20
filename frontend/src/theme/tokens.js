/**
 * Theme tokens — private CSS custom properties for the Home Weather panel.
 * These are the source of truth for all visual styling.
 */

// Private tokens --hw-* are set via CSS custom properties on :host.
// They are designed to work in both light and dark modes.

export const TOKENS = {
  // Base colors
  '--hw-bg': '#111111',
  '--hw-surface': '#1c1c1c',
  '--hw-surface-2': '#161616',
  '--hw-elevated': '#282828',
  '--hw-input-bg': '#282828',
  '--hw-text': '#e1e1e1',
  '--hw-muted': '#9b9b9b',
  '--hw-disabled': '#6f6f6f',
  '--hw-accent': '#03a9f4',
  '--hw-accent-hover': '#29b6f6',
  '--hw-accent-dim': 'rgba(3, 169, 244, 0.15)',
  '--hw-danger': '#f44336',
  '--hw-warning': '#ff9800',
  '--hw-success': '#4caf50',
  '--hw-border': '#252525',
  '--hw-border-strong': '#333333',
  '--hw-hover': '#222222',
  // Shadows
  '--shadow-sm': '0 1px 2px rgba(0,0,0,0.3)',
  '--shadow': '0 4px 6px rgba(0,0,0,0.4)',
  '--shadow-md': '0 8px 16px rgba(0,0,0,0.5)',
  '--shadow-lg': '0 16px 32px rgba(0,0,0,0.6)',
  // Radii
  '--radius-sm': '6px',
  '--radius-md': '10px',
  '--radius-lg': '16px',
  '--radius-xl': '20px',
  '--radius-full': '9999px',
  // Spacing
  '--space-1': '4px',
  '--space-2': '8px',
  '--space-3': '12px',
  '--space-4': '16px',
  '--space-5': '24px',
  '--space-6': '32px',
  // Typography
  '--fs-xs': '11px',
  '--fs-sm': '12px',
  '--fs-body': '14px',
  '--fs-md': '16px',
  '--fs-lg': '20px',
  '--fs-xl': '28px',
  '--fs-2xl': '36px',
  '--fs-hero': 'clamp(64px, 18vw, 104px)',
  // Easing
  '--ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
  '--ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  '--ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  // Durations
  '--dur-fast': '150ms',
  '--dur-normal': '250ms',
  '--dur-slow': '400ms',
};

export const LIGHT_TOKENS = {
  '--hw-bg': '#f5f5f5',
  '--hw-surface': '#ffffff',
  '--hw-surface-2': '#f0f0f0',
  '--hw-elevated': '#e8e8e8',
  '--hw-input-bg': '#ffffff',
  '--hw-text': '#1a1a1a',
  '--hw-muted': '#666666',
  '--hw-disabled': '#999999',
  '--hw-accent': '#0288d1',
  '--hw-accent-hover': '#0277bd',
  '--hw-accent-dim': 'rgba(2, 136, 209, 0.12)',
  '--hw-danger': '#d32f2f',
  '--hw-warning': '#e65100',
  '--hw-success': '#2e7d32',
  '--hw-border': '#e0e0e0',
  '--hw-border-strong': '#cccccc',
  '--hw-hover': '#eeeeee',
  '--shadow-sm': '0 1px 2px rgba(0,0,0,0.08)',
  '--shadow': '0 4px 6px rgba(0,0,0,0.1)',
  '--shadow-md': '0 8px 16px rgba(0,0,0,0.12)',
  '--shadow-lg': '0 16px 32px rgba(0,0,0,0.15)',
};
