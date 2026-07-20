export class LightningCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3 style="margin:0 0 var(--space-3)">Lightning</h3><p class="text-muted">No recent lightning activity</p>';
    return card;
  }
}
