export class Travel_advisoryCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3 style="margin:0 0 var(--space-3)">Travel Advisory</h3><p class="text-muted">No travel advisories</p>';
    return card;
  }
}
