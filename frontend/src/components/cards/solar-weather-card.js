export class Solar_weatherCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3 style="margin:0 0 var(--space-3)">Solar Weather</h3><p class="text-muted">Solar activity: Low</p>';
    return card;
  }
}
