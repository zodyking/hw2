"""Air quality data coordinator."""
from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from ..const import UPDATE_INTERVAL
from ..storage import HomeWeatherStorage

_LOGGER = logging.getLogger(__name__)


class AirQualityCoordinator(DataUpdateCoordinator):
    def __init__(self, hass: HomeAssistant, storage: HomeWeatherStorage) -> None:
        super().__init__(hass, _LOGGER, name="home_weather_air_quality", update_interval=timedelta(seconds=UPDATE_INTERVAL))
        self.storage = storage

    async def _async_update_data(self) -> dict:
        config = await self.storage.async_get()
        try:
            return {"aqi": None, "category": None, "alerts": []}
        except Exception as err:
            raise UpdateFailed(f"Error fetching air quality data: {err}") from err
