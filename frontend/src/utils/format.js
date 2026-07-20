/**
 * Formatting utilities — date/time, moon phase, wind, units.
 */

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const COMPASS_POINTS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
];
const MOON_PHASES = [
  'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
  'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
];

/**
 * Format a date to weekday abbreviation.
 * @param {Date|string|number} date
 * @returns {string} e.g. "Mon"
 */
export function weekdayShort(date) {
  const d = date instanceof Date ? date : new Date(date);
  return WEEKDAYS[d.getDay()];
}

/**
 * Format a date to short date string.
 * @param {Date|string|number} date
 * @returns {string} e.g. "Jan 5"
 */
export function shortDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Format a time to 12h string.
 * @param {Date|string|number} date
 * @returns {string} e.g. "3:30 PM"
 */
export function time12(date) {
  const d = date instanceof Date ? date : new Date(date);
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * Calculate moon phase name from a Date.
 * Uses a simple astronomical approximation.
 * @param {Date} [date=new Date()]
 * @returns {string} Phase name
 */
export function moonPhase(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;

  if (month < 3) {
    c = year - 1;
    e = month + 12;
  } else {
    c = year;
    e = month;
  }

  jd = Math.floor(365.25 * (c + 4716)) + Math.floor(30.6001 * (e + 1)) + day - 1524.5;
  b = (jd - 2451550.1) / 29.530588853;
  b = b - Math.floor(b);
  if (b < 0) b += 1;

  const index = Math.floor(b * 8);
  return MOON_PHASES[index % 8];
}

/**
 * Convert wind direction in degrees to compass label.
 * @param {number|null|undefined} degrees
 * @returns {string} e.g. "NW"
 */
export function compassFromDegrees(degrees) {
  if (degrees == null || isNaN(degrees)) return '—';
  const idx = Math.round(((degrees % 360) / 22.5) + 0.5) % 16;
  return COMPASS_POINTS[idx];
}

/**
 * Convert knots to mph.
 * @param {number|null} knots
 * @returns {number|null}
 */
export function knotsToMph(knots) {
  if (knots == null) return null;
  return Math.round(knots * 1.15078);
}

/**
 * Convert celsius to fahrenheit.
 * @param {number|null} c
 * @returns {number|null}
 */
export function cToF(c) {
  if (c == null) return null;
  return Math.round((c * 9) / 5 + 32);
}

/**
 * Format a distance in miles to a readable string.
 * @param {number|null} miles
 * @returns {string}
 */
export function formatDistance(miles) {
  if (miles == null) return '—';
  return `${Math.round(miles)} mi`;
}

/**
 * Format a number to a rounded string with optional unit.
 * @param {number|null} value
 * @param {string} [unit='']
 * @param {number} [decimals=0]
 * @returns {string}
 */
export function formatNumber(value, unit = '', decimals = 0) {
  if (value == null || isNaN(value)) return '—';
  const v = decimals > 0 ? value.toFixed(decimals) : Math.round(value);
  return unit ? `${v} ${unit}` : `${v}`;
}

/**
 * Escape HTML special characters.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
