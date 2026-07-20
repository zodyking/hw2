"""Tornado data coordinator."""
from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from ..const import UPDATE_INTERVAL
from ..storage import HomeWeatherStorage

_LOGGER = logging.getLogger(__name__)


class TornadoCoordinator(DataUpdateCoordinator):
    """Tornado data coordinator."""

    def __init__(self, hass: HomeAssistant, storage: HomeWeatherStorage) -> None:
        super().__init__(hass, _LOGGER, name="home_weather_tornado", update_interval=timedelta(seconds=UPDATE_INTERVAL))
        self.storage = storage

    async def _async_update_data(self) -> dict:
        config = await self.storage.async_get()
        try:
            from ..data.tornado_data import async_get_tornado_data
            return await async_get_tornado_data(self.hass, config)
        except Exception as err:
            raise UpdateFailed(f"Error fetching tornado data: {err}") from err
