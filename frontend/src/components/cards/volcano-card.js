export class VolcanoCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3 style="margin:0 0 var(--space-3)">Volcano</h3><p class="text-muted">No active volcano alerts</p>';
    return card;
  }
}
