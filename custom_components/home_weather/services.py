"""WebSocket API services for Home Weather."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

# Guard: ensure WS is registered only once per hass instance
_registered_instances: set[int] = set()


@callback
def async_setup_websocket_api(hass: HomeAssistant) -> None:
    """Set up the WebSocket API for Home Weather."""
    # Use object id of hass to ensure only one registration per instance
    hass_id = id(hass)
    if hass_id in _registered_instances:
        return
    _registered_instances.add(hass_id)

    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_set_config)
    websocket_api.async_register_command(hass, ws_get_weather)
    websocket_api.async_register_command(hass, ws_get_hurricanes)
    websocket_api.async_register_command(hass, ws_get_tornadoes)
    websocket_api.async_register_command(hass, ws_get_earthquakes)
    websocket_api.async_register_command(hass, ws_get_lightning)
    websocket_api.async_register_command(hass, ws_get_volcanoes)
    websocket_api.async_register_command(hass, ws_get_wildfires)
    websocket_api.async_register_command(hass, ws_get_air_quality)
    websocket_api.async_register_command(hass, ws_get_space_map)
    websocket_api.async_register_command(hass, ws_get_solar_weather)
    websocket_api.async_register_command(hass, ws_get_travel_advisories)
    websocket_api.async_register_command(hass, ws_get_version)
    websocket_api.async_register_command(hass, ws_get_automations)
    websocket_api.async_register_command(hass, ws_test_tts)


def _get_entry_data(hass: HomeAssistant, entry_id: str | None = None) -> dict[str, Any] | None:
    """Get the entry data for a given entry_id, or first available."""
    domain_data = hass.data.get(DOMAIN, {})
    if not domain_data:
        return None

    if entry_id:
        return domain_data.get(entry_id)

    # Fall back to first entry
    for data in domain_data.values():
        if isinstance(data, dict) and "storage" in data:
            return data
    return None


@websocket_api.websocket_command({
    "type": "home_weather/get_config",
    "entry_id": str,
})
@websocket_api.async_response
async def ws_get_config(hass: HomeAssistant, connection, msg):
    """Return current configuration."""
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        storage = data.get("storage")
        if storage:
            config = await storage.async_get()
            connection.send_result(msg["id"], config)
            return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    "type": "home_weather/set_config",
    "config": dict,
    "entry_id": str,
})
@websocket_api.async_response
async def ws_set_config(hass: HomeAssistant, connection, msg):
    """Update and save configuration."""
    config = msg.get("config", {})
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        storage = data.get("storage")
        if storage:
            await storage.async_save(config)
            # Refresh coordinators
            for key, coord in data.items():
                if key.endswith("_coordinator") or key == "coordinator":
                    await coord.async_request_refresh()
            connection.send_result(msg["id"], {"success": True})
            return
    connection.send_result(msg["id"], {"success": False, "error": "No entry found"})


@websocket_api.websocket_command({
    "type": "home_weather/get_weather",
    "entry_id": str,
})
@websocket_api.async_response
async def ws_get_weather(hass: HomeAssistant, connection, msg):
    """Return weather data."""
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        coordinator = data.get("coordinator")
        if coordinator:
            connection.send_result(msg["id"], coordinator.data or {})
            return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    "type": "home_weather/get_hurricanes",
    "entry_id": str,
    "force_refresh": False,
})
@websocket_api.async_response
async def ws_get_hurricanes(hass: HomeAssistant, connection, msg):
    """Return hurricane data."""
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        coordinator = data.get("hurricane_coordinator")
        if coordinator:
            if msg.get("force_refresh"):
                await coordinator.async_request_refresh()
            connection.send_result(msg["id"], coordinator.data or {})
            return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    "type": "home_weather/get_tornadoes",
    "entry_id": str,
})
@websocket_api.async_response
async def ws_get_tornadoes(hass: HomeAssistant, connection, msg):
    """Return tornado data."""
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        coordinator = data.get("tornado_coordinator")
        if coordinator:
            connection.send_result(msg["id"], coordinator.data or {})
            return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    "type": "home_weather/get_earthquakes",
    "entry_id": str,
})
@websocket_api.async_response
async def ws_get_earthquakes(hass: HomeAssistant, connection, msg):
    """Return earthquake data."""
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        coordinator = data.get("earthquake_coordinator")
        if coordinator:
            connection.send_result(msg["id"], coordinator.data or {})
            return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    "type": "home_weather/get_lightning",
    "entry_id": str,
})
@websocket_api.async_response
async def ws_get_lightning(hass: HomeAssistant, connection, msg):
    """Return lightning data."""
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        coordinator = data.get("lightning_coordinator")
        if coordinator:
            connection.send_result(msg["id"], coordinator.data or {})
            return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    "type": "home_weather/get_volcanoes",
    "entry_id": str,
})
@websocket_api.async_response
async def ws_get_volcanoes(hass: HomeAssistant, connection, msg):
    """Return volcano data."""
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        coordinator = data.get("volcano_coordinator")
        if coordinator:
            connection.send_result(msg["id"], coordinator.data or {})
            return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    "type": "home_weather/get_wildfires",
    "entry_id": str,
})
@websocket_api.async_response
async def ws_get_wildfires(hass: HomeAssistant, connection, msg):
    """Return wildfire data."""
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        coordinator = data.get("wildfire_coordinator")
        if coordinator:
            connection.send_result(msg["id"], coordinator.data or {})
            return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    "type": "home_weather/get_air_quality",
    "entry_id": str,
})
@websocket_api.async_response
async def ws_get_air_quality(hass: HomeAssistant, connection, msg):
    """Return air quality data."""
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        coordinator = data.get("air_quality_coordinator")
        if coordinator:
            connection.send_result(msg["id"], coordinator.data or {})
            return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    "type": "home_weather/get_space_map",
    "entry_id": str,
})
@websocket_api.async_response
async def ws_get_space_map(hass: HomeAssistant, connection, msg):
    """Return space map data."""
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        coordinator = data.get("space_coordinator")
        if coordinator:
            connection.send_result(msg["id"], coordinator.data or {})
            return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    "type": "home_weather/get_solar_weather",
    "entry_id": str,
})
@websocket_api.async_response
async def ws_get_solar_weather(hass: HomeAssistant, connection, msg):
    """Return solar weather data."""
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        coordinator = data.get("space_coordinator")
        if coordinator:
            space_data = coordinator.data or {}
            connection.send_result(msg["id"], {
                "solar_activity": space_data.get("solar_activity"),
                "k_index": space_data.get("k_index"),
                "sunspot_count": space_data.get("sunspot_count"),
                "flare_count": space_data.get("flare_count"),
            })
            return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    "type": "home_weather/get_travel_advisories",
    "entry_id": str,
})
@websocket_api.async_response
async def ws_get_travel_advisories(hass: HomeAssistant, connection, msg):
    """Return travel advisory data."""
    entry_id = msg.get("entry_id")
    data = _get_entry_data(hass, entry_id)
    if data:
        coordinator = data.get("travel_coordinator")
        if coordinator:
            connection.send_result(msg["id"], coordinator.data or {})
            return
    connection.send_result(msg["id"], {})


@websocket_api.websocket_command({
    "type": "home_weather/get_version",
})
@websocket_api.async_response
async def ws_get_version(hass: HomeAssistant, connection, msg):
    """Return integration version."""
    import json
    from pathlib import Path
    manifest_path = Path(__file__).parent / "manifest.json"
    version = "2.0.0"
    try:
        manifest_text = manifest_path.read_text("utf-8")
        version = str(json.loads(manifest_text).get("version", "2.0.0"))
    except Exception:
        pass
    connection.send_result(msg["id"], {"version": version})


@websocket_api.websocket_command({
    "type": "home_weather/get_automations",
})
@websocket_api.async_response
async def ws_get_automations(hass: HomeAssistant, connection, msg):
    """Return all automation entities."""
    automations = []
    for entity_id in hass.states.async_entity_ids("automation"):
        automations.append({"entity_id": entity_id, "state": hass.states.get(entity_id).state})
    connection.send_result(msg["id"], automations)


@websocket_api.websocket_command({
    "type": "home_weather/test_tts",
    "message": str,
    "entity_id": str,
})
@websocket_api.async_response
async def ws_test_tts(hass: HomeAssistant, connection, msg):
    """Test TTS playback."""
    try:
        service_data = {
            "entity_id": msg.get("entity_id", ""),
            "message": msg.get("message", "Test message"),
        }
        await hass.services.async_call("tts", "speak", service_data, blocking=True)
        connection.send_result(msg["id"], {"success": True})
    except Exception as e:
        connection.send_result(msg["id"], {"success": False, "error": str(e)})
