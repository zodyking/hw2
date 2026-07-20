"""Storage for Home Weather configuration."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN, STORAGE_KEY, STORAGE_VERSION

_LOGGER = logging.getLogger(__name__)


class HomeWeatherStorage:
    """Home Weather configuration storage."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data: dict[str, Any] = {}
        self._hass = hass

    async def async_load(self) -> None:
        """Load data from storage."""
        try:
            stored = await self._store.async_load()
            if stored:
                self._data = stored
        except Exception as e:
            _LOGGER.error("Error loading storage: %s", e)

    async def async_save(self, data: dict[str, Any]) -> None:
        """Save data to storage."""
        self._data = data
        await self._store.async_save(data)

    async def async_get(self) -> dict[str, Any]:
        """Get a copy of current data."""
        if not self._data:
            await self.async_load()
        return dict(self._data or {})

    async def async_delete(self) -> None:
        """Delete all stored data."""
        self._data = {}
        await self._store.async_remove()

    def is_configured(self) -> bool:
        """Check if integration is configured."""
        return bool(self._data.get("weather_entity"))

    @property
    def data(self) -> dict[str, Any]:
        """Return current data."""
        return dict(self._data or {})
