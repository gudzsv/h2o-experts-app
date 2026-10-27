// Generates the app icons in public/icons from public/favicon.svg.
// Run after changing the favicon: node scripts/generate-pwa-icons.mjs
import { mkdir, readFile } from 'node:fs/promises';
import sharp from 'sharp';

const BACKGROUND = '#323f47'; // --dark-blue
const OUT_DIR = 'public/icons';

// `scale` is the share of the icon taken by the glass. Maskable icons may be
// cropped to a circle, so their glass stays inside the central 80% safe zone.
const ICONS = [
  { name: 'pwa-192.png', size: 192, scale: 0.6 },
  { name: 'pwa-512.png', size: 512, scale: 0.6 },
  { name: 'maskable-512.png', size: 512, scale: 0.5 },
  { name: 'apple-touch-icon.png', size: 180, scale: 0.6 },
];

const svg = await readFile('public/favicon.svg');
await mkdir(OUT_DIR, { recursive: true });

for (const { name, size, scale } of ICONS) {
  const glassSize = Math.round(size * scale);
  const glass = await sharp(svg, { density: 1200 })
    .resize(glassSize, glassSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: glass, gravity: 'center' }])
    .flatten({ background: BACKGROUND })
    .png()
    .toFile(`${OUT_DIR}/${name}`);
}
