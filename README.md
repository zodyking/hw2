# Home Weather

A Home Assistant custom integration with a full-screen weather panel, animated conditions, NWS alerts, hurricane tracking, and configurable TTS.

## Features

- **Live conditions** — Animated atmosphere hero with temp, feels-like, wind, UV, humidity
- **Forecasts** — 7-day list and 24-hour timeline
- **NWS alerts** — Active warnings with expandable details
- **Hurricane tracker** — Storm cone + home threat summary
- **Space weather** — Solar activity monitoring
- **Modular dashboard** — Customize your layout with drag-and-drop cards
- **True light/dark themes** — Fully unlocked theme system
- **Mobile-first** — Responsive design that works beautifully on phones

## Install

1. HACS → Integrations → ⋮ → **Custom repositories**
2. Add `https://github.com/zodyking/home-weather` (category: Integration)
3. Install **Home Weather** and restart Home Assistant
4. Settings → Devices & services → **Add integration** → Home Weather

## Requirements

- Home Assistant 2024.1+
- Weather entity supporting `weather.get_forecasts`
