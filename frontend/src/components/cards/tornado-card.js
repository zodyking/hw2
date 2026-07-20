export class TornadoCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3 style="margin:0 0 var(--space-3)">Tornado Warnings</h3><p class="text-muted">No active tornado warnings</p>`;
    return card;
  }
}
