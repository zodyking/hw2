/**
 * WebSocket API client — typed wrapper around Home Assistant's WS connection.
 */

export class WsApi {
  /**
   * @param {object} hass The hass object injected by HA
   */
  constructor(hass) {
    this._hass = hass;
    this._id = 0;
    this._pending = new Map();
    this._subs = new Map();
    this._connected = false;

    if (this._hass && this._hass.connection) {
      this._conn = this._hass.connection;
      this._connected = true;
    }
  }

  /**
   * Send a request and get a response.
   * @param {object} msg WS message (without id)
   * @returns {Promise<any>}
   */
  async call(msg) {
    if (!this._conn) {
      throw new Error('WS connection not available');
    }
    const id = ++this._id;
    return new Promise((resolve, reject) => {
      this._pending.set(id, { resolve, reject });
      this._conn.subscribeMessage(
        (resp) => this._handleResponse(id, resp),
        { ...msg, id }
      );
    });
  }

  _handleResponse(id, resp) {
    const pending = this._pending.get(id);
    if (!pending) return;
    this._pending.delete(id);
    if (resp.success === false) {
      pending.reject(new Error(resp.error?.message || 'WS error'));
    } else {
      pending.resolve(resp.result);
    }
  }

  /**
   * Subscribe to events.
   * @param {string} type WS event type
   * @param {Function} handler
   * @returns {Promise<Function>} unsubscribe
   */
  async subscribe(type, handler) {
    if (!this._conn) return () => {};
    const id = ++this._id;
    const unsub = await this._conn.subscribeMessage(handler, { type, id });
    this._subs.set(id, unsub);
    return unsub;
  }

  /**
   * Call a Home Weather WS command.
   * @param {string} command e.g. "get_weather", "get_hurricanes"
   * @param {object} [params]
   * @returns {Promise<any>}
   */
  async command(command, params = {}) {
    return this.call({
      type: `home_weather/${command}`,
      ...params,
    });
  }

  // ---- Convenience methods ----

  async getConfig() {
    return this.command('get_config');
  }

  async setConfig(config) {
    return this.command('set_config', { config });
  }

  async getWeather() {
    return this.command('get_weather');
  }

  async getHurricanes() {
    return this.command('get_hurricanes');
  }

  async getTornadoes() {
    return this.command('get_tornadoes');
  }

  async getEarthquakes() {
    return this.command('get_earthquakes');
  }

  async getLightning() {
    return this.command('get_lightning');
  }

  async getVolcanoes() {
    return this.command('get_volcanoes');
  }

  async getWildfires() {
    return this.command('get_wildfires');
  }

  async getAirQuality() {
    return this.command('get_air_quality');
  }

  async getTravelAdvisories() {
    return this.command('get_travel_advisories');
  }

  async getSpaceMap() {
    return this.command('get_space_map');
  }

  async getSolarWeather() {
    return this.command('get_solar_weather');
  }

  async getVersion() {
    return this.command('get_version');
  }

  isConnected() {
    return this._connected;
  }
}
