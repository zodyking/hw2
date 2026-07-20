export class Spacecraft_passCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3 style="margin:0 0 var(--space-3)">Spacecraft Pass</h3><p class="text-muted">No upcoming passes</p>';
    return card;
  }
}
