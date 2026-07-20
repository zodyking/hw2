/**
 * DashboardView — main forecast dashboard with modular card layout.
 */

import { AtmosphereCard } from '../components/cards/atmosphere-card.js';
import { ForecastCard } from '../components/cards/forecast-card.js';
import { RadarCard } from '../components/cards/radar-card.js';
import { MoonSunCard } from '../components/cards/moon-sun-card.js';
import { NWSAlertsCard } from '../components/cards/nws-alerts-card.js';
import { HurricaneCard } from '../components/cards/hurricane-card.js';
import { SpaceCard } from '../components/cards/space-card.js';

// Fallback data so cards render immediately even before WS data arrives
const FALLBACK_WEATHER = {
  current: { temperature: '--', condition: 'Loading...', apparent_temperature: '--', wind_speed: '--', wind_bearing: '', humidity: '--', uv_index: '--' },
  daily: [], hourly: [], alerts: [], sun: {},
};
const FALLBACK_HURRICANE = { storms: [], summary: { threatLevel: 'none', closestStormName: 'No storms', distanceToCenterMiles: null, insideCone: false } };
const FALLBACK_SPACE = { solar_activity: 'Loading...', k_index: '--', sunspot_count: '--', flare_count: '--' };

export class DashboardView {
  constructor({ panel, ws, root }) {
    this._panel = panel;
    this._ws = ws;
    this._root = root;
    this._layout = null;
    this._weatherData = null;
    this._hurricaneData = null;
    this._spaceData = null;

    // Default cards matching original layout 1:1
    this._defaultCards = [
      { id: 'atmosphere', type: 'atmosphere', size: 'full' },
      { id: 'forecast', type: 'forecast', size: 'full' },
      { id: 'radar', type: 'radar', size: 'full' },
      { id: 'moonsun', type: 'moonsun', size: 'half' },
      { id: 'nwsalerts', type: 'nwsalerts', size: 'half' },
      { id: 'hurricane', type: 'hurricane', size: 'half' },
      { id: 'space', type: 'space', size: 'half' },
    ];
  }

  async _loadData() {
    if (!this._ws) return;
    try {
      const [weather, hurricanes, space] = await Promise.allSettled([
        this._ws.getWeather(),
        this._ws.getHurricanes(),
        this._ws.getSpaceMap(),
      ]);
      if (weather.status === 'fulfilled') this._weatherData = weather.value;
      if (hurricanes.status === 'fulfilled') this._hurricaneData = hurricanes.value;
      if (space.status === 'fulfilled') this._spaceData = space.value;
    } catch (e) {
      console.warn('Dashboard data load error:', e);
    }
  }

  _getCards() {
    const saved = this._panel._dashboardLayout;
    return saved && saved.length > 0 ? saved : this._defaultCards;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'dashboard-view';

    // Edit mode bar
    if (this._panel._editMode) {
      const editBar = document.createElement('div');
      editBar.className = 'dashboard-edit-bar';
      editBar.innerHTML = `
        <span class="text-accent" style="font-weight:600">Customize Mode</span>
        <div class="flex gap-2">
          <button class="btn btn-ghost" id="reset-layout">Reset to Default</button>
          <button class="btn btn-ghost" id="cancel-edit">Cancel</button>
          <button class="btn btn-primary" id="save-layout">Save Layout</button>
        </div>
      `;
      container.appendChild(editBar);
    } else {
      const customizeBtn = document.createElement('button');
      customizeBtn.className = 'btn btn-ghost';
      customizeBtn.innerHTML = 'Customize';
      customizeBtn.style.marginBottom = 'var(--space-3)';
      customizeBtn.addEventListener('click', () => {
        this._panel._editMode = true;
        this._panel._scheduleRender();
      });
      container.appendChild(customizeBtn);
    }

    // Dashboard grid
    const grid = document.createElement('div');
    grid.className = 'dashboard-grid';

    const cards = this._getCards();
    for (const cardConfig of cards) {
      const cardEl = this._renderCard(cardConfig);
      if (cardEl) grid.appendChild(cardEl);
    }

    container.appendChild(grid);

    // Attach edit handlers
    if (this._panel._editMode) {
      const resetBtn = container.querySelector('#reset-layout');
      const cancelBtn = container.querySelector('#cancel-edit');
      const saveBtn = container.querySelector('#save-layout');
      if (resetBtn) resetBtn.addEventListener('click', () => this._resetLayout());
      if (cancelBtn) cancelBtn.addEventListener('click', () => this._cancelEdit());
      if (saveBtn) saveBtn.addEventListener('click', () => this._saveLayout());
    }

    return container;
  }

  _renderCard(config) {
    const slot = document.createElement('div');
    slot.className = `card-slot card-${config.size || 'full'}`;
    slot.dataset.cardId = config.id;

    // Card controls in edit mode
    if (this._panel._editMode) {
      const controls = document.createElement('div');
      controls.className = 'card-slot-controls';
      controls.innerHTML = `
        <button class="card-slot-btn" data-action="remove" title="Remove">&times;</button>
        <button class="card-slot-btn" data-action="settings" title="Settings">*</button>
      `;
      slot.appendChild(controls);
    }

    // Card content
    const content = document.createElement('div');
    content.className = 'card-content';

    switch (config.type) {
      case 'atmosphere': {
        const card = new AtmosphereCard({ data: this._weatherData || FALLBACK_WEATHER });
        content.appendChild(card.render());
        break;
      }
      case 'forecast': {
        const card = new ForecastCard({ data: this._weatherData || FALLBACK_WEATHER });
        content.appendChild(card.render());
        break;
      }
      case 'radar': {
        const card = new RadarCard({ config: this._panel._config });
        content.appendChild(card.render());
        break;
      }
      case 'moonsun': {
        const card = new MoonSunCard({ data: this._weatherData || FALLBACK_WEATHER });
        content.appendChild(card.render());
        break;
      }
      case 'nwsalerts': {
        const card = new NWSAlertsCard({ data: this._weatherData || FALLBACK_WEATHER });
        content.appendChild(card.render());
        break;
      }
      case 'hurricane': {
        const card = new HurricaneCard({ data: this._hurricaneData || FALLBACK_HURRICANE });
        content.appendChild(card.render());
        break;
      }
      case 'space': {
        const card = new SpaceCard({ data: this._spaceData || FALLBACK_SPACE });
        content.appendChild(card.render());
        break;
      }
      default: {
        content.innerHTML = `<p class="text-muted">Unknown card: ${config.type}</p>`;
      }
    }

    slot.appendChild(content);
    return slot;
  }

  _resetLayout() {
    this._panel._dashboardLayout = null;
    this._panel._editMode = false;
    this._panel._scheduleRender();
  }

  _cancelEdit() {
    this._panel._editMode = false;
    this._panel._scheduleRender();
  }

  _saveLayout() {
    this._panel._editMode = false;
    this._panel._scheduleRender();
  }
}
