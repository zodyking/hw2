import { context, build } from 'esbuild';
import { mkdirSync, copyFileSync, writeFileSync, existsSync, readdirSync, statSync, readFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const PANEL_ENTRY = join(root, 'frontend/src/main.js');
const PANEL_OUT = join(root, 'custom_components/home_weather/www/weather-panel.js');

const MAP_SOURCES = [
  { entry: 'frontend/src/space-map.js', out: 'custom_components/home_weather/www/space-map.js' },
  { entry: 'frontend/src/hurricane-tracker.js', out: 'custom_components/home_weather/www/hurricane-tracker.js' },
  { entry: 'frontend/src/blitzortung-client.js', out: 'custom_components/home_weather/www/blitzortung-client.js' },
  { entry: 'frontend/src/zone-editor.js', out: 'custom_components/home_weather/www/zone-editor.js' },
];

// Ensure output dirs exist
function ensureDir(p) {
  mkdirSync(dirname(p), { recursive: true });
}

// Copy static assets
function copyStaticAssets() {
  const srcDir = join(root, 'frontend/public');
  const outDir = join(root, 'custom_components/home_weather/www');
  if (!existsSync(srcDir)) return;
  const walk = (dir, base = '') => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const rel = join(base, entry);
      if (statSync(full).isDirectory()) {
        walk(full, rel);
      } else {
        const dest = join(outDir, rel);
        ensureDir(dest);
        copyFileSync(full, dest);
      }
    }
  };
  walk(srcDir);
}

// Bundle the main panel
async function bundlePanel(minify = true, sourcemap = false) {
  const opts = {
    entryPoints: [PANEL_ENTRY],
    bundle: true,
    outfile: PANEL_OUT,
    format: 'iife',
    target: ['es2018'],
    minify,
    sourcemap,
    logLevel: 'info',
    legalComments: 'none',
    loader: {
      '.css': 'text',
    },
  };
  return build(opts);
}

// Bundle a map module (already IIFE, just minify/optimize)
async function bundleMap(src, out, minify = true) {
  const absEntry = join(root, src);
  const absOut = join(root, out);
  ensureDir(absOut);
  // These are already standalone IIFE modules — copy as-is for now
  copyFileSync(absEntry, absOut);
  console.log(`Copied ${src} -> ${out}`);
}

const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
const isMapsOnly = args.includes('--maps');
const isPanelOnly = args.includes('--panel') || !isMapsOnly;

if (isMapsOnly) {
  // Only build maps
  for (const m of MAP_SOURCES) {
    await bundleMap(m.entry, m.out, true);
  }
  copyStaticAssets();
  console.log('Maps build complete.');
} else if (isWatch) {
  // Watch mode for panel
  const ctx = await context({
    entryPoints: [join(root, PANEL_ENTRY)],
    bundle: true,
    outfile: PANEL_OUT,
    format: 'iife',
    target: ['es2018'],
    minify: false,
    sourcemap: 'inline',
    logLevel: 'info',
    loader: {
      '.css': 'text',
    },
  });
  await ctx.watch();
  console.log('Watching panel for changes...');
} else {
  console.log('Building Home Weather V2 panel...');
  await bundlePanel(true, false);
  console.log(`Panel bundled -> ${PANEL_OUT}`);

  // Also bundle maps
  for (const m of MAP_SOURCES) {
    await bundleMap(m.entry, m.out, true);
  }
  copyStaticAssets();
  console.log('Build complete.');
}
