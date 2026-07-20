export class QuoteCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3 style="margin:0 0 var(--space-3)">Quote</h3><p class="text-muted">"Believe you can and you\'re halfway there."</p>';
    return card;
  }
}
