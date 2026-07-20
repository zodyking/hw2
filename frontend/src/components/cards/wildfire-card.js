export class WildfireCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3 style="margin:0 0 var(--space-3)">Wildfire</h3><p class="text-muted">No active wildfires</p>';
    return card;
  }
}
