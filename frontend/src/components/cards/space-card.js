/**
 * SpaceCard — orbital position / solar weather snapshot.
 */

export class SpaceCard {
  constructor({ data }) {
    this._data = data;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'card space-card';

    const space = this._data || {};

    card.innerHTML = `
      <h3 style="margin:0 0 var(--space-3);font-size:var(--fs-lg)">Space Weather</h3>
      <div class="space-card-content">
        <div class="space-card-title">Solar Activity</div>
        <div class="text-muted" style="font-size:var(--fs-sm)">
          ${space.solar_activity || 'No significant activity'}
        </div>
        <div style="margin-top:var(--space-3);display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-2);text-align:center">
          <div>
            <div style="font-size:var(--fs-sm);color:var(--hw-muted)">K-Index</div>
            <div style="font-weight:600">${space.k_index ?? '--'}</div>
          </div>
          <div>
            <div style="font-size:var(--fs-sm);color:var(--hw-muted)">Sunspots</div>
            <div style="font-weight:600">${space.sunspot_count ?? '--'}</div>
          </div>
          <div>
            <div style="font-size:var(--fs-sm);color:var(--hw-muted)">Flares</div>
            <div style="font-weight:600">${space.flare_count ?? '--'}</div>
          </div>
        </div>
      </div>
    `;

    return card;
  }
}
