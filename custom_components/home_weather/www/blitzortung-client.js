/**
 * BlitzortungClient — WebSocket client for real-time lightning data.
 * Cleaned up: proper reconnect, exponential backoff, cleanup.
 */

(function (global) {
  'use strict';

  const RECONNECT_BASE_MS = 2000;
  const RECONNECT_MAX_MS = 30000;

  class BlitzortungClient {
    constructor(options) {
      this._url = options.url;
      this._onStrike = options.onStrike || (() => {});
      this._onStatus = options.onStatus || (() => {});
      this._ws = null;
      this._reconnectDelay = RECONNECT_BASE_MS;
      this._reconnectTimer = null;
      this._isClosed = false;
    }

    connect() {
      if (this._isClosed) return;
      try {
        this._ws = new WebSocket(this._url);
        this._ws.binaryType = 'arraybuffer';

        this._ws.onopen = () => {
          this._reconnectDelay = RECONNECT_BASE_MS;
          this._onStatus('connected');
        };

        this._ws.onmessage = (event) => {
          if (event.data instanceof ArrayBuffer) {
            const strike = this._decodeStrike(event.data);
            if (strike) this._onStrike(strike);
          }
        };

        this._ws.onerror = () => {
          this._onStatus('error');
        };

        this._ws.onclose = () => {
          this._onStatus('disconnected');
          this._scheduleReconnect();
        };
      } catch (e) {
        this._scheduleReconnect();
      }
    }

    _scheduleReconnect() {
      if (this._isClosed) return;
      clearTimeout(this._reconnectTimer);
      this._reconnectTimer = setTimeout(() => {
        this._reconnectDelay = Math.min(this._reconnectDelay * 2, RECONNECT_MAX_MS);
        this.connect();
      }, this._reconnectDelay);
    }

    _decodeStrike(buffer) {
      // Simplified: real Blitzortung protocol is proprietary
      // This is a placeholder that returns null
      return null;
    }

    close() {
      this._isClosed = true;
      clearTimeout(this._reconnectTimer);
      if (this._ws) {
        this._ws.onclose = null; // prevent reconnect
        this._ws.close();
        this._ws = null;
      }
    }
  }

  global.BlitzortungClient = BlitzortungClient;
})(window);
