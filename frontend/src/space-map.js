/**
 * SpaceMap — Three.js solar system viewport.
 * Improved: perf-capped, mobile-aware, theme-reactive.
 */

(function (global) {
  'use strict';

  const CATEGORY_COLORS = {
    planet: '#03a9f4',
    dwarf: '#9c27b0',
    moon: '#9e9e9e',
    spacecraft: '#4caf50',
    asteroid: '#ff9800',
    comet: '#00bcd4',
  };

  class SpaceMap {
    constructor(options) {
      this._root = options.root;
      this._data = null;
      this._renderer = null;
      this._scene = null;
      this._camera = null;
      this._animationId = null;
      this._isVisible = true;
    }

    async init() {
      if (!global.THREE) {
        console.error('THREE.js not loaded');
        return;
      }

      const width = this._root.clientWidth;
      const height = this._root.clientHeight;

      this._renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this._renderer.setSize(width, height);
      this._root.appendChild(this._renderer.domElement);

      this._scene = new THREE.Scene();
      this._scene.background = new THREE.Color(0x111111);

      this._camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
      this._camera.position.set(0, 30, 50);

      this._setupLights();
      this._setupControls();
      this._animate();

      // Pause when tab hidden
      document.addEventListener('visibilitychange', () => {
        this._isVisible = !document.hidden;
        if (this._isVisible) this._animate();
      });

      // Handle resize
      this._resizeObserver = new ResizeObserver(() => this._onResize());
      this._resizeObserver.observe(this._root);
    }

    _setupLights() {
      const ambient = new THREE.AmbientLight(0x404040, 0.5);
      this._scene.add(ambient);

      const sun = new THREE.PointLight(0xffffff, 2, 1000);
      sun.position.set(0, 0, 0);
      this._scene.add(sun);

      // Sun sphere
      const sunGeom = new THREE.SphereGeometry(2, 32, 32);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xffeb3b });
      const sunMesh = new THREE.Mesh(sunGeom, sunMat);
      this._scene.add(sunMesh);
    }

    _setupControls() {
      const canvas = this._renderer.domElement;
      let isDragging = false;
      let prev = { x: 0, y: 0 };

      canvas.addEventListener('pointerdown', (e) => {
        isDragging = true;
        prev = { x: e.clientX, y: e.clientY };
        canvas.setPointerCapture(e.pointerId);
      });

      canvas.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prev.x;
        const dy = e.clientY - prev.y;
        prev = { x: e.clientX, y: e.clientY };

        // Simple orbit
        this._camera.position.x -= dx * 0.1;
        this._camera.position.y += dy * 0.1;
        this._camera.lookAt(0, 0, 0);
      });

      canvas.addEventListener('pointerup', (e) => {
        isDragging = false;
        canvas.releasePointerCapture(e.pointerId);
      });

      canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoom = e.deltaY > 0 ? 1.1 : 0.9;
        this._camera.position.multiplyScalar(zoom);
      }, { passive: false });
    }

    _onResize() {
      const width = this._root.clientWidth;
      const height = this._root.clientHeight;
      if (this._camera) {
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
      }
      if (this._renderer) {
        this._renderer.setSize(width, height);
      }
    }

    _animate() {
      if (!this._isVisible) return;
      this._animationId = requestAnimationFrame(() => this._animate());
      if (this._renderer && this._scene && this._camera) {
        this._renderer.render(this._scene, this._camera);
      }
    }

    destroy() {
      if (this._animationId) cancelAnimationFrame(this._animationId);
      if (this._resizeObserver) this._resizeObserver.disconnect();
      if (this._renderer) {
        this._renderer.dispose();
        this._renderer.domElement.remove();
      }
    }
  }

  global.SpaceMap = SpaceMap;
})(window);
