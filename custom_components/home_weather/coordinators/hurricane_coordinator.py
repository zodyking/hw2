"""Hurricane data coordinator."""
from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from ..const import UPDATE_INTERVAL
from ..storage import HomeWeatherStorage
from ..data.hurricane_data import async_get_hurricane_data

_LOGGER = logging.getLogger(__name__)


class HurricaneCoordinator(DataUpdateCoordinator):
    """Hurricane data coordinator."""

    def __init__(self, hass: HomeAssistant, storage: HomeWeatherStorage) -> None:
        """Initialize hurricane coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name="home_weather_hurricane",
            update_interval=timedelta(seconds=UPDATE_INTERVAL),
        )
        self.storage = storage

    async def _async_update_data(self) -> dict:
        """Fetch hurricane data from NOAA/NHC."""
        config = await self.storage.async_get()
        try:
            return await async_get_hurricane_data(self.hass, config)
        except Exception as err:
            raise UpdateFailed(f"Error fetching hurricane data: {err}") from err
