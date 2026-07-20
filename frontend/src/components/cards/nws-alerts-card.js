/**
 * NWSAlertsCard — active NWS warnings display.
 */

export class NWSAlertsCard {
  constructor({ data }) {
    this._data = data;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'card nws-alerts-card';

    const weather = this._data || {};
    const alerts = weather.alerts || [];

    const header = document.createElement('h3');
    header.style.cssText = 'margin:0 0 var(--space-3);font-size:var(--fs-lg)';
    header.textContent = 'NWS Alerts';
    card.appendChild(header);

    if (alerts.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'alerts-empty';
      empty.innerHTML = '<p>No active alerts for your area</p>';
      card.appendChild(empty);
      return card;
    }

    const list = document.createElement('div');
    list.className = 'alerts-list';

    alerts.forEach((alert) => {
      const item = document.createElement('div');
      item.className = `alert-item ${alert.severity || 'minor'}`;
      item.innerHTML = `
        <div class="alert-headline">${alert.headline || alert.event || 'Weather Alert'}</div>
        <div class="alert-meta">${alert.severity || ''} · ${alert.urgency || ''}</div>
      `;
      list.appendChild(item);
    });

    card.appendChild(list);
    return card;
  }
}
