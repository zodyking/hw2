"""TTS Trigger Manager for Home Weather."""
from __future__ import annotations

import logging
from typing import Any, Callable

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)


class TTSTriggerManager:
    """Manages TTS triggers for weather alerts and announcements."""

    def __init__(
        self,
        hass: HomeAssistant,
        get_config: Callable[[], dict],
        get_weather_data: Callable[[], dict],
        refresh_weather_data: Callable[[], Any] | None = None,
    ) -> None:
        """Initialize TTS trigger manager."""
        self._hass = hass
        self._get_config = get_config
        self._get_weather_data = get_weather_data
        self._refresh_weather_data = refresh_weather_data
        self._timers: list = []
        self._listeners: list = []

    async def async_setup(self) -> None:
        """Set up TTS trigger listeners."""
        config = self._get_config()
        tts_config = config.get("tts", {})
        if not tts_config.get("enabled", False):
            return
        # Set up time-based triggers, sensor listeners, etc.
        _LOGGER.info("TTS triggers initialized")

    async def async_unload(self) -> None:
        """Clean up TTS triggers."""
        for timer in self._timers:
            timer()
        for unsub in self._listeners:
            unsub()
        self._timers.clear()
        self._listeners.clear()
        _LOGGER.info("TTS triggers unloaded")
