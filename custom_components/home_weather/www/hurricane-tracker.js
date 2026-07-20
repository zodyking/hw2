/**
 * HurricaneTracker — Leaflet hazard map.
 * Cleaned up: LayerRegistry, Legend, HomeThreatBanner, mobile-first controls, central state model.
 */

(function (global) {
  'use strict';

  const STORM_COLORS = ['#e53935', '#fb8c00', '#8e24aa', '#1e88e5', '#43a047'];
  const CATEGORY_COLORS = {
    0: '#5ebaff', 1: '#ffffb2', 2: '#ffe775', 3: '#ffc140', 4: '#ff8f20', 5: '#ff5050',
  };

  class HurricaneTracker {
    constructor(options) {
      this._hass = options.hass;
      this._shadow = options.shadowRoot;
      this._root = null;
      this._map = null;
      this._data = null;

      // Central state model
      this._state = {
        layers: { hurricane: true, tornado: false, earthquakes: true, lightning: false, volcanoes: false, wildfire: false, air_quality: false, travel: false },
        homeThreat: null,
        viewport: null,
      };

      // Layer registry — one LayerGroup per hazard, z-ordered
      this._layers = {};
      this._refreshTimer = null;
    }

    async init(rootEl) {
      this._root = rootEl;
      if (!global.L) {
        console.error('Leaflet not loaded');
        return;
      }

      this._map = global.L.map(rootEl, {
        center: [39.8, -98.5],
        zoom: 4,
        zoomControl: false,
      });

      global.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(this._map);

      // Zoom control bottom-right
      global.L.control.zoom({ position: 'bottomright' }).addTo(this._map);

      // Initialize layer groups (z-ordered)
      this._layers.hurricane = global.L.layerGroup().addTo(this._map);
      this._layers.tornado = global.L.layerGroup().addTo(this._map);
      this._layers.earthquakes = global.L.layerGroup().addTo(this._map);
      this._layers.volcanoes = global.L.layerGroup().addTo(this._map);
      this._layers.wildfire = global.L.layerGroup().addTo(this._map);
      this._layers.lightning = global.L.layerGroup().addTo(this._map);
      this._layers.travel = global.L.layerGroup().addTo(this._map);
      this._layers.air_quality = global.L.layerGroup().addTo(this._map);

      this._addLegend();
      this._addHomeThreatBanner();
      await this.loadData();

      this._refresh_timer = setInterval(() => this.loadData(), 5 * 60 * 1000);
    }

    async loadData(force = false) {
      if (!this._hass) return;
      try {
        const resp = await this._hass.callWS({
          type: 'home_weather/get_hurricanes',
          force_refresh: force,
        });
        this._data = resp || {};
        this._state.homeThreat = this._data.summary || null;
        this._renderMap();
      } catch (e) {
        console.warn('Hurricane data load failed:', e);
      }
    }

    _renderMap() {
      // Clear all layers
      for (const k of Object.keys(this._layers)) {
        this._layers[k].clearLayers();
      }

      // Render storms
      const storms = this._data?.storms || [];
      storms.forEach((storm, idx) => {
        this._drawStorm(storm, idx);
      });

      this._updateHomeThreatBanner();
    }

    /**
     * Draw a single storm with unified path.
     * Uses Saffir-Simpson color coding by category.
     */
    _drawStorm(storm, idx) {
      const L = global.L;
      if (!L) return;

      // Color by Saffir-Simpson category (not positional index)
      const color = CATEGORY_COLORS[storm.category] || CATEGORY_COLORS[0] || STORM_COLORS[idx % STORM_COLORS.length];

      // 1. Cone (bottom layer)
      if (storm.cone?.coordinates) {
        L.geoJSON(storm.cone, {
          style: { color, weight: 1, fillColor: color, fillOpacity: 0.15, opacity: 0.6 },
        }).addTo(this._layers.hurricane);
      }

      // 2. Wind radii (between cone and path)
      if (storm.windRadii) {
        L.geoJSON(storm.windRadii, {
          style: { color, weight: 1, dashArray: '4 4', fillOpacity: 0.05, opacity: 0.4 },
        }).addTo(this._layers.hurricane);
      }

      // 3. Unified path: past + future as one continuous line
      // Past segment: gray | Future segment: category colored
      const pastCoords = storm.pastTrack?.coordinates || [];
      const futureCoords = storm.track?.coordinates || [];

      // Past track — solid gray
      if (pastCoords.length > 1) {
        const pastLatLngs = pastCoords.map((c) => [c[1], c[0]]);
        L.polyline(pastLatLngs, {
          color: '#90a4ae', weight: 3, opacity: 0.8,
        }).addTo(this._layers.hurricane);
      }

      // Future track — category colored with direction arrowheads
      if (futureCoords.length > 1) {
        const futureLatLngs = futureCoords.map((c) => [c[1], c[0]]);
        L.polyline(futureLatLngs, {
          color, weight: 4, opacity: 0.9,
        }).addTo(this._layers.hurricane);

        // Arrowheads on future segment (every Nth segment)
        for (let i = 0; i < futureLatLngs.length - 1; i += Math.max(1, Math.floor(futureLatLngs.length / 5))) {
          const a = futureLatLngs[i];
          const b = futureLatLngs[i + 1] || a;
          const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
          const angle = Math.atan2(b[1] - a[1], b[0] - a[0]) * (180 / Math.PI);
          L.marker(mid, {
            icon: L.divIcon({
              className: 'hw-arrow-icon',
              html: `<div style="transform:rotate(${angle}deg);color:${color};font-size:14px">&#9650;</div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            }),
          }).addTo(this._layers.hurricane);
        }
      }

      // 4. Forecast points — small ticks on the line (not overlapping)
      const forecastPoints = storm.forecastPoints || [];
      forecastPoints.forEach((pt) => {
        if (pt.lat == null || pt.lon == null) return;
        const isCurrent = pt.hour === 0;
        L.circleMarker([pt.lat, pt.lon], {
          radius: isCurrent ? 6 : 3,
          color: '#fff',
          weight: 1,
          fillColor: color,
          fillOpacity: 0.95,
        }).bindTooltip(pt.hour != null ? `${pt.hour}H` : '', {
          permanent: isCurrent,
          direction: 'right',
          className: 'hw-forecast-label',
          offset: [6, 0],
        }).addTo(this._layers.hurricane);
      });

      // 5. Past points — subtle gray dots
      (storm.pastPoints || []).forEach((pt) => {
        if (pt.lat == null || pt.lon == null) return;
        L.circleMarker([pt.lat, pt.lon], {
          radius: 3, color: '#cfd8dc', weight: 1, fillColor: '#78909c', fillOpacity: 0.7,
        }).addTo(this._layers.hurricane);
      });

      // 6. Watch/warning line — separate overlay, dashed red along coast
      if (storm.watchWarning?.coordinates?.length) {
        const watchLatLngs = storm.watchWarning.coordinates.map((c) => [c[1], c[0]]);
        L.polyline(watchLatLngs, {
          color: '#f44336', weight: 2, opacity: 0.85, dashArray: '8 4',
        }).addTo(this._layers.hurricane);
      }

      // 7. Current position marker
      const pos = storm.currentPosition;
      if (pos?.lat != null && pos?.lon != null) {
        const icon = L.divIcon({
          className: 'hw-storm-marker',
          html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 6px ${color}"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker([pos.lat, pos.lon], { icon, zIndexOffset: 500 })
          .bindPopup(`<strong>${storm.name}</strong><br>Max wind: ${storm.maxWindMph || '--'} mph<br>Pressure: ${storm.pressureMb || '--'} mb<br>Movement: ${storm.movement || '--'}`)
          .addTo(this._layers.hurricane);
      }
    }

    _addLegend() {
      const L = global.L;
      if (!L) return;

      const legend = L.control({ position: 'bottomleft' });
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'hw-map-legend');
        div.style.cssText = 'background:rgba(28,28,28,0.9);color:#e1e1e1;padding:8px 12px;border-radius:8px;font-size:12px;max-width:180px;border:1px solid #333';
        div.innerHTML = `
          <strong>Storm Category</strong>
          <div style="margin-top:4px"><span style="color:#5ebaff">&#9679;</span> Tropical</div>
          <div><span style="color:#ffffb2">&#9679;</span> Category 1</div>
          <div><span style="color:#ffe775">&#9679;</span> Category 2</div>
          <div><span style="color:#ffc140">&#9679;</span> Category 3</div>
          <div><span style="color:#ff8f20">&#9679;</span> Category 4</div>
          <div><span style="color:#ff5050">&#9679;</span> Category 5</div>
          <div style="margin-top:4px"><span style="color:#90a4ae">&#8212;</span> Past track</div>
          <div><span style="color:#f44336">- -</span> Watch/Warning</div>
        `;
        return div;
      };
      legend.addTo(this._map);
    }

    _addHomeThreatBanner() {
      const L = global.L;
      if (!L) return;

      const banner = L.control({ position: 'topright' });
      banner.onAdd = () => {
        const div = L.DomUtil.create('div', 'hw-home-threat-banner');
        div.id = 'hw-threat-banner';
        div.style.cssText = 'background:rgba(28,28,28,0.92);color:#e1e1e1;padding:8px 14px;border-radius:8px;font-size:13px;border:1px solid #333;max-width:220px';
        div.innerHTML = '<div style="font-weight:600">Loading threat data...</div>';
        return div;
      };
      banner.addTo(this._map);
    }

    _updateHomeThreatBanner() {
      const banner = document.getElementById('hw-threat-banner');
      if (!banner) return;

      const threat = this._state.homeThreat;
      if (!threat) {
        banner.innerHTML = '<div style="font-weight:600">No threat data</div>';
        return;
      }

      const level = threat.threatLevel || 'none';
      const colors = { none: '#4caf50', monitor: '#03a9f4', watch: '#ff9800', high: '#f44336' };
      const color = colors[level] || colors.none;

      banner.innerHTML = `
        <div style="font-weight:600;margin-bottom:4px">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color}"></span>
          Home Threat: ${level.toUpperCase()}
        </div>
        <div style="font-size:12px;color:#9b9b9b">${threat.closestStormName || 'No storms'}</div>
        ${threat.distanceToCenterMiles != null ? `<div style="font-size:12px">${Math.round(threat.distanceToCenterMiles)} mi from center</div>` : ''}
        ${threat.insideCone ? '<div style="color:#ff9800;margin-top:4px;font-weight:600">Inside forecast cone</div>' : ''}
      `;
    }

    setMapLayers(layers) {
      this._state.layers = { ...this._state.layers, ...layers };
      // Show/hide each layer group
      for (const [key, group] of Object.entries(this._layers)) {
        if (this._state.layers[key]) {
          if (!this._map.hasLayer(group)) this._map.addLayer(group);
        } else {
          if (this._map.hasLayer(group)) this._map.removeLayer(group);
        }
      }
    }

    refresh() { return this.loadData(true); }

    destroy() {
      if (this._refresh_timer) clearInterval(this._refresh_timer);
      if (this._map) this._map.remove();
    }
  }

  global.HurricaneTracker = HurricaneTracker;
})(window);
