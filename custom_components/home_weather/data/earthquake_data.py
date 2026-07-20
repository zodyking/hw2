"""Fetch and normalize USGS earthquake data."""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

_LOGGER = logging.getLogger(__name__)


async def async_get_earthquake_data(
    hass: HomeAssistant,
    config: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Return normalized earthquake data from USGS."""
    session = async_get_clientsession(hass)
    config = config or {}

    min_mag = config.get("earthquake_monitoring", {}).get("min_magnitude", 2.5) if isinstance(config.get("earthquake_monitoring"), dict) else 2.5

    try:
        url = f"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
        async with session.get(url, timeout=30) as resp:
            resp.raise_for_status()
            data = await resp.json()

        features = data.get("features", [])
        earthquakes = []
        for f in features:
            props = f.get("properties", {})
            mag = props.get("mag")
            if mag is not None and mag >= min_mag:
                geom = f.get("geometry", {})
                coords = geom.get("coordinates", [0, 0, 0])
                earthquakes.append({
                    "id": props.get("id", ""),
                    "magnitude": mag,
                    "place": props.get("place", ""),
                    "time": props.get("time", ""),
                    "depth": coords[2] if len(coords) > 2 else None,
                    "lon": coords[0],
                    "lat": coords[1],
                    "url": props.get("url", ""),
                })

        return {
            "earthquakes": earthquakes,
            "geojson": {"type": "FeatureCollection", "features": features},
            "summary": {
                "count": len(earthquakes),
                "maxMagnitude": max((e["magnitude"] for e in earthquakes), default=None),
                "minMagnitude": min((e["magnitude"] for e in earthquakes), default=None),
            },
            "fetchedAt": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        _LOGGER.warning("Failed to fetch earthquake data: %s", e)
        return {
            "earthquakes": [],
            "geojson": {"type": "FeatureCollection", "features": []},
            "summary": {"count": 0, "maxMagnitude": None, "minMagnitude": None},
            "fetchedAt": datetime.now(timezone.utc).isoformat(),
        }
