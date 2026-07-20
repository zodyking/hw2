"""Fetch and normalize NOAA/NHC hurricane GIS data."""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

_LOGGER = logging.getLogger(__name__)

ARCGIS_MAPSERVER = (
    "https://mapservices.weather.noaa.gov/tropical/rest/services/"
    "tropical/NHC_tropical_weather/MapServer"
)


async def async_get_hurricane_data(
    hass: HomeAssistant,
    config: dict[str, Any] | None = None,
    *,
    force_refresh: bool = False,
) -> dict[str, Any]:
    """Return normalized hurricane data with home-relative summary."""
    session = async_get_clientsession(hass)

    try:
        storms = await _fetch_from_arcgis(session)
    except Exception as err:
        _LOGGER.warning("ArcGIS hurricane fetch failed: %s", err)
        storms = []

    return {
        "storms": storms,
        "outlook": {},
        "summary": {
            "activeCount": len(storms),
            "closestStormId": None,
            "closestStormName": None,
            "distanceToCenterMiles": None,
            "distanceToNearestForecastMiles": None,
            "insideCone": False,
            "threatLevel": "none",
            "estimatedClosestApproachHour": None,
            "stale": False,
            "warning": None,
            "fetchedAt": datetime.now(timezone.utc).isoformat(),
        },
        "source": "arcgis",
    }


async def _fetch_from_arcgis(session: Any) -> list[dict[str, Any]]:
    """Fetch storm data from NOAA ArcGIS MapServer."""
    async with session.get(f"{ARCGIS_MAPSERVER}?f=json", timeout=30) as resp:
        resp.raise_for_status()
        metadata = await resp.json()

    layers = metadata.get("layers") or []
    storms: list[dict[str, Any]] = []

    # Find forecast points layer
    for layer in layers:
        name = layer.get("name", "")
        if "Forecast Points" in name:
            try:
                geo = await _query_layer_geojson(session, layer["id"], ARCGIS_MAPSERVER)
                for feature in geo.get("features", []):
                    props = feature.get("properties", {})
                    geom = feature.get("geometry", {})
                    coords = geom.get("coordinates")
                    if coords and len(coords) >= 2:
                        storms.append({
                            "id": props.get("idp_source", "unknown"),
                            "name": props.get("stormname", "Unknown"),
                            "basin": props.get("basin", "AL"),
                            "currentPosition": {"lat": coords[1], "lon": coords[0]},
                            "maxWindMph": _knots_to_mph(props.get("maxwind")),
                            "pressureMb": props.get("mslp"),
                            "movement": _format_movement(props.get("tcdir"), props.get("tcspd")),
                            "category": props.get("ssnum"),
                            "track": None,
                            "pastTrack": None,
                            "forecastPoints": [],
                            "cone": None,
                            "windRadii": None,
                            "pastPoints": [],
                            "watchWarning": None,
                            "advisoryTime": props.get("advdate"),
                            "threat": {"threatLevel": "none", "insideCone": False, "distanceToCenterMiles": None, "nearestTrackDistanceMiles": None, "nearestForecastHour": None},
                        })
            except Exception as e:
                _LOGGER.warning("Failed to parse forecast points: %s", e)

    return storms


async def _query_layer_geojson(
    session: Any, layer_id: int | None, mapserver: str
) -> dict[str, Any]:
    """Query a single layer's GeoJSON."""
    if layer_id is None:
        return {"type": "FeatureCollection", "features": []}
    url = f"{mapserver}/{layer_id}/query"
    params = {"where": "1=1", "outFields": "*", "f": "geojson", "returnGeometry": "true"}
    async with session.get(url, params=params, timeout=30) as resp:
        resp.raise_for_status()
        return await resp.json()


def _knots_to_mph(knots: float | None) -> int | None:
    if knots is None:
        return None
    try:
        return int(round(float(knots) * 1.15078))
    except (TypeError, ValueError):
        return None


def _format_movement(dir_deg: float | None, speed_knots: float | None) -> str | None:
    if dir_deg is None and speed_knots is None:
        return None
    parts = []
    if dir_deg is not None:
        labels = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
        idx = int((float(dir_deg) % 360) / 22.5 + 0.5) % 16
        parts.append(labels[idx])
    if speed_knots is not None:
        mph = _knots_to_mph(speed_knots)
        if mph is not None:
            parts.append(f"at {mph} mph")
    return " ".join(parts) if parts else None
