"""Lightning data helpers."""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)


async def async_get_lightning_data(
    hass: HomeAssistant,
    config: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Return lightning data (placeholder — real data comes from Blitzortung WebSocket)."""
    return {
        "strikes": [],
        "hourly_count": 0,
        "nearest": None,
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }
