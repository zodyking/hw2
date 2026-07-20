"""Weather Coordinator for Home Weather."""
from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import UPDATE_INTERVAL
from .storage import HomeWeatherStorage

_LOGGER = logging.getLogger(__name__)


class WeatherCoordinator(DataUpdateCoordinator):
    """Weather data coordinator."""

    def __init__(self, hass: HomeAssistant, storage: HomeWeatherStorage) -> None:
        """Initialize weather coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name="home_weather",
            update_interval=timedelta(seconds=UPDATE_INTERVAL),
        )
        self.storage = storage

    async def _async_update_data(self) -> dict:
        """Fetch weather data from configured entity."""
        config = await self.storage.async_get()
        entity_id = config.get("weather_entity")

        if not entity_id:
            return {}

        try:
            states = self.hass.states.get(entity_id)
            if not states:
                raise UpdateFailed(f"Weather entity {entity_id} not found")

            # Call weather.get_forecasts service
            try:
                service_data = {
                    "entity_id": entity_id,
                    "type": "daily",
                }
                daily_resp = await self.hass.services.async_call(
                    "weather", "get_forecasts", service_data, blocking=True, return_response=True
                )
            except Exception:
                daily_resp = {}

            try:
                service_data = {
                    "entity_id": entity_id,
                    "type": "hourly",
                }
                hourly_resp = await self.hass.services.async_call(
                    "weather", "get_forecasts", service_data, blocking=True, return_response=True
                )
            except Exception:
                hourly_resp = {}

            return {
                "entity_id": entity_id,
                "current": states.attributes,
                "daily": daily_resp.get(entity_id, {}).get("forecast", []) if daily_resp else [],
                "hourly": hourly_resp.get(entity_id, {}).get("forecast", []) if hourly_resp else [],
                "alerts": config.get("nws_alerts", {}).get("alerts", []),
            }

        except UpdateFailed:
            raise
        except Exception as err:
            raise UpdateFailed(f"Error fetching weather data: {err}") from err
