/**
 * Entry point — register the Home Weather panel web component.
 */

import { HomeWeatherPanel } from './panel.js';

// Register the custom element
if (!customElements.get('home-weather-panel')) {
  customElements.define('home-weather-panel', HomeWeatherPanel);
}

// Panel registration info for Home Assistant
window.HomeWeatherPanel = HomeWeatherPanel;
