export class WindCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3 style="margin:0 0 var(--space-3)">Wind</h3><p class="text-muted">Wind: -- mph</p>';
    return card;
  }
}
