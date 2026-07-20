"""Lightning data coordinator."""
from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from ..const import UPDATE_INTERVAL
from ..storage import HomeWeatherStorage

_LOGGER = logging.getLogger(__name__)


class LightningCoordinator(DataUpdateCoordinator):
    def __init__(self, hass: HomeAssistant, storage: HomeWeatherStorage) -> None:
        super().__init__(hass, _LOGGER, name="home_weather_lightning", update_interval=timedelta(seconds=UPDATE_INTERVAL))
        self.storage = storage
        self._shutdown = False

    async def _async_update_data(self) -> dict:
        config = await self.storage.async_get()
        try:
            from ..data.lightning_data import async_get_lightning_data
            return await async_get_lightning_data(self.hass, config)
        except Exception as err:
            raise UpdateFailed(f"Error fetching lightning data: {err}") from err

    async def async_shutdown(self) -> None:
        self._shutdown = True
