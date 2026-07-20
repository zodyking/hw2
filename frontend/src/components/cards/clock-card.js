export class ClockCard {
  constructor({ data }) { this._data = data; }
  render() {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = '<h3 style="margin:0 0 var(--space-3)">Clock</h3><p class="text-muted">Current time</p>';
    return card;
  }
}
