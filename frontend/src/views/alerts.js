/**
 * AlertsView — NWS alert browser.
 */

export class AlertsView {
  constructor({ panel, ws, root }) {
    this._panel = panel;
    this._ws = ws;
    this._root = root;
    this._alerts = [];
  }

  async _loadData() {
    if (!this._ws) return;
    try {
      const weather = await this._ws.getWeather();
      this._alerts = weather?.alerts || [];
    } catch (e) {
      console.warn('Failed to load alerts:', e);
    }
  }

  async render() {
    await this._loadData();

    const container = document.createElement('div');
    container.className = 'alerts-view';

    const header = document.createElement('h2');
    header.style.cssText = 'margin:0 0 var(--space-4)';
    header.textContent = 'Weather Alerts';
    container.appendChild(header);

    if (this._alerts.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'card';
      empty.innerHTML = '<p class="text-muted" style="text-align:center;padding:var(--space-6)">No active alerts for your area</p>';
      container.appendChild(empty);
      return container;
    }

    const list = document.createElement('div');
    list.className = 'alerts-list';

    this._alerts.forEach((alert) => {
      const card = document.createElement('div');
      card.className = `card alert-item ${alert.severity || 'minor'}`;
      card.style.marginBottom = 'var(--space-2)';
      card.innerHTML = `
        <div class="alert-headline">${alert.headline || alert.event || 'Weather Alert'}</div>
        <div class="alert-meta">${alert.severity || ''} · ${alert.urgency || ''}</div>
        <div style="margin-top:var(--space-2);font-size:var(--fs-body);color:var(--hw-text)">
          ${(alert.description || '').slice(0, 200)}${(alert.description || '').length > 200 ? '...' : ''}
        </div>
      `;
      list.appendChild(card);
    });

    container.appendChild(list);
    return container;
  }
}
