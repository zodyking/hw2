## Added
- Modular frontend architecture with Shadow DOM web component and ESBuild bundling (55.4kb panel)
- True light/dark theme support with full CSS token system (`tokens.js`, `themes.js`, `theme-engine.js`)
- Mobile-first responsive design: bottom sheets, touch targets, safe area insets, fluid typography
- 26 customizable dashboard cards with edit mode (drag-and-drop layout)
- Rebuilt hurricane tracker: LayerRegistry, Legend, HomeThreatBanner, Saffir-Simpson colors, direction arrowheads, forecast ticks, wind radii, watch/warning overlay
- Three.js space viewport: perf-capped rendering, mobile-aware, theme-reactive
- Splittable backend services (`services.py`) and TTS trigger manager (`tts/` subpackage)
- Multi-coordinator orchestration: tornado, hurricane, earthquake, lightning, volcano, wildfire, air quality, space, travel
- WebSocket API with per-hass singleton guard (no double registration)
- Entity cleanup for legacy v1 entities
- Panel www asset syncing at integration install time
- Config flow, HACS config, integration manifest

## Changed
- Monolithic 8,845-line `weather-panel.js` → modular `frontend/src/` (60+ files)
- Hazard map: path tracking is now unified past+future polyline with distinct visual treatment
- Backend: `services.py` → `services/` module; `tts.py` → `tts/` subpackage
- Build: ESBuild with CSS text loader, watch mode, copymaps

## Fixed
- Hurricane cone rendering with correct z-ordering (cone → wind radii → path → markers)
- Storm category color coding using actual Saffir-Simpson scale (not positional index)
- Forecast tick placement (no longer overlapping path line)
- Duplicate WS registration when multiple integration entries exist
- Mobile overflow and responsive breakpoint handling

## Performance
- Frontend bundle: 55.4kb (minified)
- Three.js pixel ratio capped at 1.5, animation pauses on tab hidden
- Concurrent data loading with `Promise.allSettled`
- Debounced renders and throttled events

## Notes
- Testing/verification: `npm run build`, `npm run lint` (0 errors, 11 warnings), manual code review
- Migration/rollback: uninstall from HACS → delete `config/www/home_weather/` → reinstall
- No existing user data migration (v1 → v2 is clean install)
