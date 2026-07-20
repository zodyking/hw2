/**
 * SettingsView — settings hub with sidebar panes.
 */

export class SettingsView {
  constructor({ panel, ws, root }) {
    this._panel = panel;
    this._ws = ws;
    this._root = root;
    this._pane = 'general-weather-source';
  }

  render() {
    const container = document.createElement('div');
    container.className = 'settings-view flex';
    container.style.maxWidth = '1000px';
    container.style.margin = '0 auto';
    container.style.gap = 'var(--space-4)';

    // Sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'settings-sidebar';
    sidebar.innerHTML = `
      <div class="settings-sidebar-group">General</div>
      <div class="settings-sidebar-item is-active" data-pane="general-weather-source">Weather Source</div>
      <div class="settings-sidebar-item" data-pane="general-about">About</div>
      <div class="settings-sidebar-group">Monitoring</div>
      <div class="settings-sidebar-item" data-pane="monitoring-tornado">Tornado</div>
      <div class="settings-sidebar-item" data-pane="monitoring-earthquake">Earthquake</div>
      <div class="settings-sidebar-item" data-pane="monitoring-lightning">Lightning</div>
      <div class="settings-sidebar-item" data-pane="monitoring-volcano">Volcano</div>
      <div class="settings-sidebar-item" data-pane="monitoring-wildfire">Wildfire</div>
      <div class="settings-sidebar-item" data-pane="monitoring-air_quality">Air Quality</div>
      <div class="settings-sidebar-group">Appearance</div>
      <div class="settings-sidebar-item" data-pane="appearance-overview">Overview</div>
      <div class="settings-sidebar-item" data-pane="appearance-theme">Theme</div>
      <div class="settings-sidebar-item" data-pane="appearance-colors">Colors</div>
    `;

    // Main content area
    const main = document.createElement('div');
    main.className = 'flex-1 p-4';

    const header = document.createElement('h2');
    header.style.cssText = 'margin:0 0 var(--space-4)';
    header.textContent = 'Settings';
    main.appendChild(header);

    const content = document.createElement('div');
    content.className = 'settings-content';
    content.innerHTML = this._renderPaneContent(this._pane);
    main.appendChild(content);

    container.appendChild(sidebar);
    container.appendChild(main);

    // Attach sidebar handlers
    sidebar.querySelectorAll('.settings-sidebar-item').forEach((item) => {
      item.addEventListener('click', () => {
        sidebar.querySelectorAll('.settings-sidebar-item').forEach((i) => i.classList.remove('is-active'));
        item.classList.add('is-active');
        this._pane = item.dataset.pane;
        content.innerHTML = this._renderPaneContent(this._pane);
      });
    });

    return container;
  }

  _renderPaneContent(pane) {
    switch (pane) {
      case 'general-weather-source':
        return `
          <div class="card">
            <h3 style="margin:0 0 var(--space-3)">Weather Source</h3>
            <p class="text-muted">Select a weather entity with daily and hourly forecasts.</p>
            <select class="select w-full" id="weather-entity-select">
              <option value="">Select entity...</option>
            </select>
            <button class="btn btn-primary" style="margin-top:var(--space-3)">Save Weather Entity</button>
          </div>
        `;

      case 'general-about':
        return `
          <div class="card">
            <h3 style="margin:0 0 var(--space-3)">About Home Weather</h3>
            <p class="text-muted">Version ${this._panel._version || '2.0.0'}</p>
            <p>A Home Assistant custom integration with full-screen weather panel, animated conditions, NWS alerts, hurricane tracking, and configurable TTS.</p>
          </div>
        `;

      case 'appearance-theme':
        return `
          <div class="card">
            <h3 style="margin:0 0 var(--space-3)">Theme</h3>
            <div style="display:flex;gap:var(--space-2)">
              <button class="btn btn-primary" data-theme="dark">Dark</button>
              <button class="btn btn-ghost" data-theme="light">Light</button>
            </div>
          </div>
        `;

      case 'appearance-colors':
        return `
          <div class="card">
            <h3 style="margin:0 0 var(--space-3)">Color Overrides</h3>
            <p class="text-muted">Customize individual theme colors.</p>
            <div style="display:grid;gap:var(--space-2);margin-top:var(--space-3)">
              <div class="flex-between"><span>Accent</span><input type="color" value="#03a9f4" style="width:40px;height:30px"></div>
              <div class="flex-between"><span>Background</span><input type="color" value="#111111" style="width:40px;height:30px"></div>
              <div class="flex-between"><span>Surface</span><input type="color" value="#1c1c1c" style="width:40px;height:30px"></div>
            </div>
          </div>
        `;

      default:
        return `<div class="card"><h3 style="margin:0">${pane.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())}</h3><p class="text-muted">Settings for ${pane.replace(/-/g, ' ')}.</p></div>`;
    }
  }
}
