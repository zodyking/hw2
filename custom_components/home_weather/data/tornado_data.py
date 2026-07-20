"""Fetch and normalize NWS tornado warning data."""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

_LOGGER = logging.getLogger(__name__)


async def async_get_tornado_data(
    hass: HomeAssistant,
    config: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Return normalized tornado warning data."""
    # NWS CAP alerts endpoint
    session = async_get_clientsession(hass)

    try:
        url = "https://api.weather.gov/alerts?status=actual&event=Tornado"
        async with session.get(url, timeout=30) as resp:
            resp.raise_for_status()
            data = await resp.json()

        features = data.get("features", [])
        alerts = []
        for f in features:
            props = f.get("properties", {})
            alerts.append({
                "id": props.get("id", ""),
                "headline": props.get("headline", ""),
                "severity": props.get("severity", ""),
                "urgency": props.get("urgency", ""),
                "description": props.get("description", ""),
                "effective": props.get("effective", ""),
                "expires": props.get("expires", ""),
                "geometry": f.get("geometry"),
            })

        return {
            "alerts": alerts,
            "geojson": {"type": "FeatureCollection", "features": [f for f in features if f.get("geometry")]},
            "summary": {
                "activeCount": len(alerts),
                "highestSeverity": None,
                "affectingHome": False,
                "distanceMiles": None,
            },
            "fetchedAt": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        _LOGGER.warning("Failed to fetch tornado data: %s", e)
        return {
            "alerts": [],
            "geojson": {"type": "FeatureCollection", "features": []},
            "summary": {"activeCount": 0, "highestSeverity": None, "affectingHome": False, "distanceMiles": None},
            "fetchedAt": datetime.now(timezone.utc).isoformat(),
        }
