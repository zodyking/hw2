"""Constants for Home Weather integration."""
from typing import Final

DOMAIN: Final = "home_weather"
STORAGE_KEY: Final = "home_weather_config"
STORAGE_VERSION: Final = 3

# Panel configuration
PANEL_URL_PATH: Final = "home-weather"
PANEL_TITLE: Final = "Home Weather"
PANEL_ICON: Final = "mdi:weather-cloudy"

# Update interval for weather coordinator (5 minutes)
UPDATE_INTERVAL: Final = 300

# Relative path under config/www for NWS alert siren files
NWS_SOUNDS_SUBPATH: Final = "home_weather/sounds"

# Number words for TTS (0-100)
NUMBER_WORDS: Final = {
    0: "zero", 1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
    6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
    11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
    16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen",
    20: "twenty", 30: "thirty", 40: "forty", 50: "fifty",
    60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety",
    100: "one hundred",
}

# Default config (subset — full DEFAULT_CONFIG in config module)
DEFAULT_CONFIG: Final = {
    "weather_entity": None,
    "appearance": {"mode": "dark", "overrides": {}},
    "dashboard_layout": None,
    "nws_zone": "",
    "hurricane_monitoring": {"enabled": True, "zone_mode": "zone", "alert_zone_mode": "zone", "max_distance_miles": 500, "min_threat_level": "monitor", "outlook_min_probability": 40},
    "tornado_monitoring": {"enabled": True, "zone_mode": "zone", "alert_zone_mode": "zone", "only_affecting_home": True, "max_distance_miles": 25},
    "earthquake_monitoring": {"enabled": True, "zone_mode": "zone", "alert_zone_mode": "zone", "min_magnitude": 2.5, "radius_miles": 500},
    "lightning_monitoring": {"enabled": True, "zone_mode": "zone", "show_on_map": True, "max_age_minutes": 60, "max_strikes": 500, "geofield_radius_miles": 100},
    "volcano_monitoring": {"enabled": True, "zone_mode": "zone", "alert_zone_mode": "zone", "radius_miles": 500, "min_alert_level": "advisory"},
    "wildfire_monitoring": {"enabled": True, "zone_mode": "zone", "alert_zone_mode": "zone", "radius_miles": 100, "show_on_map": True, "show_perimeters": True, "min_acres": 100, "exclude_prescribed": True},
    "air_quality_monitoring": {"enabled": True, "zone_mode": "zone", "alert_zone_mode": "zone", "radius_miles": 50, "show_on_map": True, "min_category_level": 1},
    "travel_monitoring": {"enabled": True, "show_on_map": True, "min_level": 1},
    "space_monitoring": {"enabled": True, "show_planets": True, "show_dwarf_planets": True, "show_moons": True, "show_spacecraft": True, "show_asteroids": True, "show_comets": True, "small_body_min_diameter_km": 0, "log_scale_orbits": True},
    "solar_weather_monitoring": {"enabled": True, "show_sunspot_regions": True, "show_flare_events": True},
    "tts": {"enabled": False, "enable_time_based": True, "enable_current_change": True, "enable_upcoming_change": True, "precip_threshold": 30, "wind_speed_threshold": 15},
    "media_players": [],
    "message_prefix": "Here's your weather forecast",
    "nws_alerts": {"enabled": False, "sound_file": "", "sound_volume": 0.8, "tts_volume": 0.9, "replay_on_time_based_forecast": True},
}
