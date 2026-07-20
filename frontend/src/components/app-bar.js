/**
 * AppBar — top navigation bar with view tabs.
 */

export class AppBar {
  constructor({ panel, currentView, isNarrow, onNavigate }) {
    this._panel = panel;
    this._currentView = currentView;
    this._isNarrow = isNarrow;
    this._onNavigate = onNavigate;
  }

  render() {
    const bar = document.createElement('div');
    bar.className = 'app-bar';

    // Brand
    const brand = document.createElement('div');
    brand.className = 'app-bar-brand';
    brand.innerHTML = `<span class="accent">Home</span> Weather`;
    bar.appendChild(brand);

    // Nav buttons (desktop)
    const nav = document.createElement('nav');
    nav.className = 'app-bar-nav';

    const views = [
      { id: 'forecast', label: 'Forecast', icon: '☁' },
      { id: 'hurricanes', label: 'Hurricanes', icon: '🌀' },
      { id: 'space', label: 'Space', icon: '🚀' },
      { id: 'alerts', label: 'Alerts', icon: '⚠' },
      { id: 'trends', label: 'Trends', icon: '📊' },
    ];

    for (const view of views) {
      const btn = document.createElement('button');
      btn.className = 'app-bar-nav-btn' + (view.id === this._currentView ? ' is-active' : '');
      btn.innerHTML = `${view.icon} ${view.label}`;
      btn.addEventListener('click', () => this._onNavigate(view.id));
      nav.appendChild(btn);
    }

    bar.appendChild(nav);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'app-bar-actions';

    // Settings gear
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'btn btn-icon btn-ghost';
    settingsBtn.innerHTML = '⚙';
    settingsBtn.title = 'Settings';
    settingsBtn.addEventListener('click', () => this._onNavigate('settings'));
    actions.appendChild(settingsBtn);

    bar.appendChild(actions);

    return bar;
  }
}
