import { existsSync, rmSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const targets = [
  join(root, 'custom_components/home_weather/www/weather-panel.js'),
  join(root, 'custom_components/home_weather/www/space-map.js'),
  join(root, 'custom_components/home_weather/www/hurricane-tracker.js'),
  join(root, 'custom_components/home_weather/www/blitzortung-client.js'),
  join(root, 'custom_components/home_weather/www/zone-editor.js'),
];

function cleanDir(dir, exclude = []) {
  if (!existsSync(dir)) return;
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = join(dir, entry);
    if (exclude.includes(entry)) continue;
    rmSync(full, { recursive: true, force: true });
  }
}

console.log('Cleaning built files...');
for (const t of targets) {
  if (existsSync(t)) {
    rmSync(t);
    console.log(`  removed ${t}`);
  }
}
console.log('Clean complete.');
