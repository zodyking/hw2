export class EarthquakeCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3 style="margin:0 0 var(--space-3)">Earthquakes</h3><p class="text-muted">No recent seismic activity</p>`;
    return card;
  }
}
