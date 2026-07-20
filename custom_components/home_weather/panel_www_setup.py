"""Panel www asset syncing for Home Weather."""
from __future__ import annotations

import logging
import os
import shutil

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)


def ensure_panel_www_assets(hass: HomeAssistant, version: str) -> None:
    """Sync bundled www assets to config/www/home_weather/."""
    config_path = hass.config.path("www/home_weather")
    marker_path = os.path.join(config_path, ".panel-version")

    # Check if already synced at this version
    if os.path.exists(marker_path):
        try:
            with open(marker_path, "r") as f:
                if f.read().strip() == version:
                    return
        except Exception:
            pass

    os.makedirs(config_path, exist_ok=True)

    # Source: bundled www
    src = os.path.join(os.path.dirname(__file__), "www")

    # Copy JS files
    for fname in ["weather-panel.js", "hurricane-tracker.js", "space-map.js", "blitzortung-client.js", "zone-editor.js"]:
        src_file = os.path.join(src, fname)
        if os.path.exists(src_file):
            shutil.copy2(src_file, os.path.join(config_path, fname))

    # Copy icons
    icons_src = os.path.join(src, "icons")
    if os.path.exists(icons_src):
        icons_dest = os.path.join(config_path, "icons")
        os.makedirs(icons_dest, exist_ok=True)
        for fname in os.listdir(icons_src):
            shutil.copy2(os.path.join(icons_src, fname), os.path.join(icons_dest, fname))

    # Write version marker
    with open(marker_path, "w") as f:
        f.write(version)

    _LOGGER.info("Panel www assets synced (v%s)", version)
