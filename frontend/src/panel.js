/**
 * HomeWeatherPanel — main web component shell.
 * Manages state, view routing, theme, and lifecycle.
 */

import { applyThemeMode } from './theme/theme-engine.js';
import { WsApi } from './utils/ws-api.js';
import { debounce, onMediaQuery } from './utils/events.js';
import { qs, clear } from './utils/render.js';

// View imports
import { DashboardView } from './views/dashboard.js';
import { HurricanesView } from './views/hurricanes.js';
import { SpaceView } from './views/space.js';
import { AlertsView } from './views/alerts.js';
import { TrendsView } from './views/trends.js';
import { SettingsView } from './views/settings.js';

// Component imports
import { AppBar } from './components/app-bar.js';
import { DetailSheet } from './components/detail-sheet.js';

// Styles (injected as string for bundling)
import globalCss from './styles/global.css';
import responsiveCss from './styles/responsive.css';
import menusCss from './styles/menus.css';
import dashboardCss from './styles/dashboard.css';

const STYLES = globalCss + responsiveCss + menusCss + dashboardCss;

export class HomeWeatherPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Core state
    this._hass = null;
    this._panel = null;
    this._config = {};
    this._currentView = 'forecast';
    this._isNarrow = false;
    this._narrowOverride = null;
    this._ws = null;
    this._version = null;
    this._appearance = { mode: 'dark', overrides: {} };
    this._dashboardLayout = null;
    this._editMode = false;

    // View instances
    this._views = {};
    this._appBar = null;
    this._detailSheet = null;

    // Debounced render
    this._scheduleRender = debounce(() => this._render(), 50);
  }

  // ---- Getters/Setters ----

  get hass() { return this._hass; }

  set hass(val) {
    this._hass = val;
    if (val && !this._ws) {
      this._ws = new WsApi(val);
    }
    this._scheduleRender();
  }

  get panel() { return this._panel; }

  set panel(val) {
    this._panel = val;
    this._scheduleRender();
  }

  get _isNarrow() {
    return this._narrowOverride !== null ? this._narrowOverride : this.__isNarrow;
  }

  set _isNarrow(val) {
    this.__isNarrow = val;
    this.classList.toggle('is-narrow', val);
    this._scheduleRender();
  }

  // ---- Lifecycle ----

  connectedCallback() {
    this._injectStyles();
    this._setupMediaQuery();
    this._setupKeyboard();
    this._loadConfig();
    this._scheduleRender();
  }

  disconnectedCallback() {
    // Cleanup
    if (this._mediaQueryCleanup) this._mediaQueryCleanup();
    if (this._resizeObserver) this._resizeObserver.disconnect();
  }

  _injectStyles() {
    const style = document.createElement('style');
    style.textContent = STYLES;
    this.shadowRoot.appendChild(style);
  }

  _setupMediaQuery() {
    this._mediaQueryCleanup = onMediaQuery('(max-width: 768px)', (matches) => {
      this._isNarrow = matches;
    });
  }

  _setupKeyboard() {
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this._detailSheet && this._detailSheet.isOpen) {
          this._detailSheet.close();
        }
      }
    });
  }

  async _loadConfig() {
    if (!this._ws) return;
    try {
      const config = await this._ws.getConfig();
      this._config = config || {};
      this._appearance = config.appearance || { mode: 'dark', overrides: {} };
      this._dashboardLayout = config.dashboard_layout || null;
      this._applyTheme();
      this._scheduleRender();
    } catch (e) {
      console.warn('Failed to load config:', e);
    }
  }

  _applyTheme() {
    applyThemeMode(this, this._appearance.mode, this._appearance.overrides);
  }

  // ---- View routing ----

  _navigateTo(view) {
    this._currentView = view;
    this._scheduleRender();
  }

  _initView(name) {
    if (this._views[name]) return this._views[name];
    const root = this.shadowRoot;
    const panel = this;
    let view;
    switch (name) {
      case 'forecast':
        view = new DashboardView({ panel, ws: this._ws, root });
        break;
      case 'hurricanes':
        view = new HurricanesView({ panel, ws: this._ws, root });
        break;
      case 'space':
        view = new SpaceView({ panel, ws: this._ws, root });
        break;
      case 'alerts':
        view = new AlertsView({ panel, ws: this._ws, root });
        break;
      case 'trends':
        view = new TrendsView({ panel, ws: this._ws, root });
        break;
      case 'settings':
        view = new SettingsView({ panel, ws: this._ws, root });
        break;
    }
    if (view) this._views[name] = view;
    return view;
  }

  // ---- Render ----

  _render() {
    const root = this.shadowRoot;
    clear(root);

    // App bar
    this._appBar = new AppBar({
      panel: this,
      currentView: this._currentView,
      isNarrow: this._isNarrow,
      onNavigate: (v) => this._navigateTo(v),
    });
    root.appendChild(this._appBar.render());

    // Main content
    const main = document.createElement('main');
    main.className = 'content-area';
    const view = this._initView(this._currentView);
    if (view) {
      main.appendChild(view.render());
    } else {
      main.innerHTML = `<div class="flex-center" style="height:200px"><p class="text-muted">Loading...</p></div>`;
    }
    root.appendChild(main);

    // Detail sheet container
    this._detailSheet = new DetailSheet({ panel: this });
    root.appendChild(this._detailSheet.render());

    // Toast container
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.id = 'toast-container';
    root.appendChild(toastContainer);
  }

  // ---- Public API for views ----

  showToast(message, type = 'info', duration = 3000) {
    const container = qs(this.shadowRoot, '#toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 300ms ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  openDetailSheet(content) {
    if (this._detailSheet) this._detailSheet.open(content);
  }

  closeDetailSheet() {
    if (this._detailSheet) this._detailSheet.close();
  }

  async saveConfig(updates) {
    if (!this._ws) return;
    try {
      const newConfig = { ...this._config, ...updates };
      await this._ws.setConfig(newConfig);
      this._config = newConfig;
      if (updates.appearance) {
        this._appearance = updates.appearance;
        this._applyTheme();
      }
      this.showToast('Settings saved', 'success');
      return true;
    } catch (e) {
      this.showToast('Failed to save: ' + e.message, 'error');
      return false;
    }
  }
}
