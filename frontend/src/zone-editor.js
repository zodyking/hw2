/**
 * ZoneEditor — radius zone editor for hazard alerts.
 */

(function (global) {
  'use strict';

  class ZoneEditor {
    constructor(options) {
      this._hass = options.hass;
      this._config = options.config || {};
      this._root = null;
      this._map = null;
    }

    async init(rootEl) {
      this._root = rootEl;
      if (!global.L) return;

      this._map = global.L.map(rootEl, {
        center: [39.8, -98.5],
        zoom: 5,
      });

      global.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(this._map);

      // Home marker
      const homeLat = this._config.home_lat || 39.8;
      const homeLon = this._config.home_lon || -98.5;

      global.L.marker([homeLat, homeLon]).addTo(this._map).bindPopup('Home');

      // Sample zone circle
      global.L.circle([homeLat, homeLon], {
        radius: 100 * 1609.34, // 100 miles in meters
        color: '#03a9f4',
        fillColor: '#03a9f4',
        fillOpacity: 0.1,
        weight: 2,
      }).addTo(this._map);
    }

    destroy() {
      if (this._map) this._map.remove();
    }
  }

  global.ZoneEditor = ZoneEditor;
})(window);
