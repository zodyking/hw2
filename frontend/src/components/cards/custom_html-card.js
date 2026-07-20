export class Custom_htmlCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3 style="margin:0 0 var(--space-3)">Custom HTML</h3><p class="text-muted">User-supplied content</p>';
    return card;
  }
}
