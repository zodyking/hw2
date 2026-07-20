/**
 * AtmosphereCard — animated hero with current conditions.
 */

export class AtmosphereCard {
  constructor({ data }) {
    this._data = data;
  }

  render() {
    const card = document.createElement('div');
    card.className = 'atmosphere-card';

    const weather = this._data || {};
    const current = weather.current || {};
    const temp = current.temperature ?? '--';
    const condition = current.condition || 'Unknown';
    const feelsLike = current.apparent_temperature ?? '--';
    const windSpeed = current.wind_speed ?? '--';
    const windDir = current.wind_bearing ?? '';
    const humidity = current.humidity ?? '--';
    const uvIndex = current.uv_index ?? '--';

    card.innerHTML = `
      <div class="atmosphere-temp">${temp}°</div>
      <div class="atmosphere-condition">${condition}</div>
      <div class="atmosphere-stats">
        <div class="stat-item">
          <span class="stat-label">Feels like</span>
          <span class="stat-value">${feelsLike}°</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Wind</span>
          <span class="stat-value">${windSpeed} mph ${windDir}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Humidity</span>
          <span class="stat-value">${humidity}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">UV Index</span>
          <span class="stat-value">${uvIndex}</span>
        </div>
      </div>
    `;

    return card;
  }
}
