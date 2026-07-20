"""Entity cleanup for Home Weather — remove legacy entities."""
from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


async def async_remove_legacy_entities(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Remove legacy entities that are no longer needed."""
    _LOGGER.info("Checking for legacy entities to remove")
