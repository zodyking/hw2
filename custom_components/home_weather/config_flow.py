"""Config flow for Home Weather."""
from __future__ import annotations

import logging

from homeassistant import config_entries

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


class HomeWeatherConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Home Weather."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        if user_input is not None:
            return self.async_create_entry(title="Home Weather", data={})

        return self.async_show_form(step_id="user")
