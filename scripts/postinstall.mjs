import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Ensure the www directory exists for panel file output
const wwwDir = join(root, 'custom_components/home_weather/www');
mkdirSync(wwwDir, { recursive: true });

// Ensure .gitkeep so www directory isn't empty in git
const gitkeep = join(wwwDir, '.gitkeep');
if (!existsSync(gitkeep)) {
  writeFileSync(gitkeep, '# Auto-generated during build\n');
}

console.log('www directory ready.');
