/**
 * RadarCard — Windy.com map embed.
 */

export class RadarCard {
  constructor({ config }) {
    this._config = config || {};
  }

  render() {
    const card = document.createElement('div');
    card.className = 'card radar-card';

    const lat = this._config.weather_entity_lat || 40.7;
    const lon = this._config.weather_entity_lon || -74;

    card.innerHTML = `
      <h3 style="margin:0 0 var(--space-3);font-size:var(--fs-lg)">Radar</h3>
      <div style="position:relative;width:100%;height:400px;border-radius:var(--radius-md);overflow:hidden">
        <iframe
          src="https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&zoom=6&level=surface&overlay=wind&menu=&message=true&marker=&calendar=&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
          style="width:100%;height:100%;border:0"
          loading="lazy"
          title="Windy.com radar">
        </iframe>
      </div>
    `;

    return card;
  }
}
