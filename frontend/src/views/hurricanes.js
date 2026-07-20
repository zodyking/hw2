/**
 * HurricanesView — Leaflet hazard map wrapper.
 * Loads the bundled hurricane-tracker.js (Leaflet-based) on demand.
 */

export class HurricanesView {
  constructor({ panel, ws, root }) {
    this._panel = panel;
    this._ws = ws;
    this._root = root;
    this._tracker = null;
    this._mapInitialized = false;
  }

  async _ensureMap() {
    if (this._mapInitialized) return;

    // Load Leaflet CSS if not loaded
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS if not loaded
    if (!window.L) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // Load hurricane tracker module if not loaded
    if (!window.HurricaneTracker) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/local/home_weather/hurricane-tracker.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    this._mapInitialized = true;
  }

  async _initMap(container) {
    await this._ensureMap();

    const mapContainer = container.querySelector('#hazard-map');
    if (!mapContainer || !window.HurricaneTracker) return;

    if (this._tracker) {
      this._tracker.refresh();
      return;
    }

    this._tracker = new window.HurricaneTracker({
      hass: this._panel.hass,
      shadowRoot: this._panel.shadowRoot,
    });

    await this._tracker.init(mapContainer);
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'hurricanes-view';
    container.innerHTML = `
      <div id="hazard-map" style="width:100%;height:calc(100vh - 120px);min-height:500px;border-radius:var(--radius-lg);overflow:hidden"></div>
    `;

    // Initialize map after render
    setTimeout(() => this._initMap(container), 0);

    return container;
  }
}
