/**
 * ForecastCard — 7-day and 24h toggleable forecast.
 */

export class ForecastCard {
  constructor({ data }) {
    this._data = data;
    this._view = '7day'; // '7day' or '24h'
  }

  render() {
    const card = document.createElement('div');
    card.className = 'card forecast-card';

    const weather = this._data || {};
    const daily = weather.daily || [];
    const hourly = weather.hourly || [];

    // Toggle header
    const header = document.createElement('div');
    header.className = 'forecast-card-header';
    header.innerHTML = '<h3 style="margin:0;font-size:var(--fs-lg)">Forecast</h3>';

    const toggle = document.createElement('div');
    toggle.className = 'forecast-toggle';

    const btn7d = document.createElement('button');
    btn7d.className = 'forecast-toggle-btn is-active';
    btn7d.textContent = '7-Day';

    const btn24h = document.createElement('button');
    btn24h.className = 'forecast-toggle-btn';
    btn24h.textContent = '24h';

    toggle.appendChild(btn7d);
    toggle.appendChild(btn24h);
    header.appendChild(toggle);
    card.appendChild(header);

    // Forecast list container
    const listContainer = document.createElement('div');
    listContainer.className = 'forecast-list-container';

    const renderList = () => {
      listContainer.innerHTML = '';
      const list = document.createElement('div');
      list.className = 'forecast-list';

      if (this._view === '7day') {
        daily.forEach((day, i) => {
          const row = document.createElement('div');
          row.className = 'forecast-row';
          row.innerHTML = `
            <span class="forecast-day">${i === 0 ? 'Today' : day.datetime ? new Date(day.datetime).toLocaleDateString('en', { weekday: 'short' }) : ''}</span>
            <span class="forecast-icon">${this._getIcon(day.condition)}</span>
            <span class="forecast-condition">${day.condition || ''}</span>
            <span class="forecast-temp">${day.temperature !== undefined ? Math.round(day.temperature) + '°' : '--'}</span>
          `;
          list.appendChild(row);
        });
      } else {
        hourly.slice(0, 24).forEach((hour) => {
          const row = document.createElement('div');
          row.className = 'forecast-row';
          row.innerHTML = `
            <span class="forecast-day">${hour.datetime ? new Date(hour.datetime).toLocaleTimeString('en', { hour: 'numeric' }) : ''}</span>
            <span class="forecast-icon">${this._getIcon(hour.condition)}</span>
            <span class="forecast-condition">${hour.condition || ''}</span>
            <span class="forecast-temp">${hour.temperature !== undefined ? Math.round(hour.temperature) + '°' : '--'}</span>
          `;
          list.appendChild(row);
        });
      }

      listContainer.appendChild(list);
    };

    btn7d.addEventListener('click', () => {
      this._view = '7day';
      btn7d.classList.add('is-active');
      btn24h.classList.remove('is-active');
      renderList();
    });

    btn24h.addEventListener('click', () => {
      this._view = '24h';
      btn24h.classList.add('is-active');
      btn7d.classList.remove('is-active');
      renderList();
    });

    renderList();
    card.appendChild(listContainer);

    return card;
  }

  _getIcon(condition) {
    const ic = {
      'clear-night': '🌙', 'cloudy': '☁️', 'fog': '🌫️', 'hail': '🌨️',
      'lightning': '⚡', 'lightning-rainy': '⛈️', 'partlycloudy': '⛅',
      'pouring': '🌧️', 'rainy': '🌧️', 'snowy': '❄️', 'snowy-rainy': '🌨️',
      'sunny': '☀️', 'windy': '💨', 'windy-variant': '💨',
    };
    return ic[condition] || ic['partlycloudy'];
  }
}
