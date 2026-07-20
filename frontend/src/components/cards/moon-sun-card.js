/**
 * MoonSunCard — moon phase, sunrise/sunset, solar info.
 */

import { moonPhase, time12 } from '../../utils/format.js';

export class MoonSunCard {
  constructor({ data }) {
    this._data = data;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'card moon-sun-card';

    const weather = this._data || {};
    const sun = weather.sun || {};
    const phase = moonPhase();

    card.innerHTML = `
      <h3 style="margin:0 0 var(--space-3);font-size:var(--fs-lg)">Moon & Sun</h3>
      <div class="moon-sun-grid">
        <div class="moon-phase-display">
          <svg class="moon-phase-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="#e0e0e0" />
            <ellipse cx="50" cy="50" rx="35" ry="45" fill="#1a1a1a" opacity="0.85" />
          </svg>
          <div>
            <div style="font-weight:600;color:var(--hw-text)">${phase}</div>
            <div style="font-size:var(--fs-sm);color:var(--hw-muted)">Current phase</div>
          </div>
        </div>
        <div class="sun-info">
          <div class="sun-info-row">
            <span class="text-muted">Sunrise</span>
            <span style="font-weight:600">${sun.sunrise ? time12(sun.sunrise) : '--'}</span>
          </div>
          <div class="sun-info-row">
            <span class="text-muted">Sunset</span>
            <span style="font-weight:600">${sun.sunset ? time12(sun.sunset) : '--'}</span>
          </div>
          <div class="sun-info-row">
            <span class="text-muted">Day Length</span>
            <span style="font-weight:600">${sun.day_length || '--'}</span>
          </div>
          <div class="sun-info-row">
            <span class="text-muted">Solar Noon</span>
            <span style="font-weight:600">${sun.solar_noon ? time12(sun.solar_noon) : '--'}</span>
          </div>
        </div>
      </div>
    `;

    return card;
  }
}
