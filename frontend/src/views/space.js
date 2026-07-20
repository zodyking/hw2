/**
 * SpaceView — three.js viewport wrapper.
 * Loads the bundled space-map.js (Three.js-based) on demand.
 */

export class SpaceView {
  constructor({ panel, ws, root }) {
    this._panel = panel;
    this._ws = ws;
    this._root = root;
    this._initialized = false;
  }

  async _ensureDeps() {
    if (this._initialized) return;

    // Load Three.js if not loaded
    if (!window.THREE) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/local/home_weather/three.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // Load space map module if not loaded
    if (!window.SpaceMap) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/local/home_weather/space-map.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    this._initialized = true;
  }

  async _initMap(container) {
    await this._ensureDeps();

    const canvasWrap = container.querySelector('#space-canvas-wrap');
    if (!canvasWrap || !window.SpaceMap) return;

    const spaceMap = new window.SpaceMap({ root: canvasWrap });
    if (spaceMap.init) await spaceMap.init();
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'space-view';
    container.innerHTML = `
      <div id="space-canvas-wrap" style="width:100%;height:calc(100vh - 120px);min-height:500px;border-radius:var(--radius-lg);overflow:hidden"></div>
    `;

    setTimeout(() => this._initMap(container), 0);

    return container;
  }
}
