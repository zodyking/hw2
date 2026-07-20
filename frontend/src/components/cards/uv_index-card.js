export class Uv_indexCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3 style="margin:0 0 var(--space-3)">UV Index</h3><p class="text-muted">UV Index: --</p>';
    return card;
  }
}
