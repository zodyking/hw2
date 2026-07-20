## Summary
- Complete ground-up rewrite of the Home Assistant custom integration
- Modular frontend architecture (Shadow DOM web component, ESBuild bundling)
- True light/dark theme support with full token system
- Mobile-first responsive design with bottom sheets, touch targets, safe areas
- 26 customizable dashboard cards with edit mode
- Rebuilt hurricane tracker with LayerRegistry, Legend, HomeThreatBanner, cleaned path tracking (Saffir-Simpson colors, arrowheads, forecast ticks, watch/warning overlay)
- Three.js space viewport (perf-capped, mobile-aware)
- Splittable backend services and TTS trigger manager
- Multi-coordinator orchestration (10 hazard types)
- WebSocket API with per-hass guard
- Entity cleanup, panel www sync, config flow

## What changed
- **Frontend**: `frontend/src/` modular ES modules bundled to `weather-panel.js` (55.4kb); views for dashboard, hurricanes, space, alerts, trends, settings; 26 card components; theme engine (`tokens.js`, `themes.js`, `theme-engine.js`); utils (format, render, events, ws-api); styles (global, responsive, menus, dashboard)
- **Maps**: `hurricane-tracker.js` rebuilt Leaflet hazard map; `space-map.js` Three.js; `blitzortung-client.js` WebSocket client; `zone-editor.js` radius zone editor
- **Python backend**: `__init__.py` entry with multi-coordinator orchestration; `services.py` WebSocket API; `coordinators/` 10 subpackages; `data/` NWS/NOAA/USGS fetchers; `tts/` trigger manager; `storage.py`, `config_flow.py`, `panel_www_setup.py`, `entity_cleanup.py`
- **Build**: `package.json` + `scripts/build.mjs` (ESBuild); `scripts/clean.mjs`, `scripts/postinstall.mjs`; `.eslintrc.json`; `hacs.json`; `README.md`

## Testing/verification
- `npm run build` — panel bundles at 55.4kb, all map modules copy cleanly
- `npm run lint` — 0 errors, 11 warnings
- Manual code review of module structure and API surfaces

## Risks/rollback
- New install — no existing user data to migrate
- Full file overwrite on upgrade from v1 due to modular restructure
- Rollback: uninstall from HACS, delete `config/www/home_weather/`, reinstall
