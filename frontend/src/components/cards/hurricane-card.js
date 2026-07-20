/**
 * HurricaneCard — storm cone + home threat summary.
 */

export class HurricaneCard {
  constructor({ data }) {
    this._data = data;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'card hurricane-card';

    const hurricane = this._data || {};
    const summary = hurricane.summary || {};
    const storms = hurricane.storms || [];

    const threatLevel = summary.threatLevel || 'none';
    const closest = summary.closestStormName ? `${summary.closestStormName}` : 'No storms';
    const dist = summary.distanceToCenterMiles !== null ? `${Math.round(summary.distanceToCenterMiles)} mi` : '';

    card.innerHTML = `
      <h3 style="margin:0 0 var(--space-3);font-size:var(--fs-lg)">Hurricane Tracker</h3>
      <div style="margin-bottom:var(--space-3)">
        <span class="hurricane-threat-badge threat-${threatLevel}">${threatLevel}</span>
        <span style="margin-left:var(--space-2);color:var(--hw-muted)">${storms.length} active storms</span>
      </div>
      <div class="flex-between" style="margin-bottom:var(--space-2)">
        <span class="text-muted">Closest Storm</span>
        <span style="font-weight:600">${closest} ${dist}</span>
      </div>
      ${summary.insideCone ? '<div style="color:var(--hw-warning);font-weight:600;margin-top:var(--space-2)">⚠ Your home is inside the forecast cone</div>' : ''}
    `;

    return card;
  }
}
