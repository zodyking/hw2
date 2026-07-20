/**
 * DashboardLayout — CSS Grid layout engine for cards.
 */

export class DashboardLayout {
  constructor({ container, cards, onReorder }) {
    this._container = container;
    this._cards = cards;
    this._onReorder = onReorder;
  }

  render() {
    const grid = document.createElement('div');
    grid.className = 'dashboard-grid';

    for (const card of this._cards) {
      const slot = document.createElement('div');
      slot.className = `card-slot card-${card.size || 'full'}`;
      slot.dataset.cardId = card.id;
      grid.appendChild(slot);
    }

    return grid;
  }
}
