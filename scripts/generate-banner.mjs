// Generates brand/banner.png + public/banner.png — the 1200x630 Open Graph /
// social banner (ISI-6417). Source of truth is this composition: locked navy
// depth gradient (brand tokens bg-depth 1-3), the canonical full-color
// horizontal lockup, and the one-line tagline. Re-run after any brand change:
//   node scripts/generate-banner.mjs
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const LOCKUP_WIDTH = 880;

const lockup = await sharp('brand/logos/k8sagentmesh-lockup-color-1600.png')
  .resize({ width: LOCKUP_WIDTH })
  .png()
  .toBuffer();
const lockupMeta = await sharp(lockup).metadata();
const lockupHeight = lockupMeta.height ?? 0;

const tagline = 'The mesh layer for agent teams on Kubernetes';

// Canvas: radial navy gradient (tokens: #101B30 focus -> #070D17 edges),
// centered slightly above middle so the lockup sits on the brightest field.
// Tagline: light neutral (#E8ECF5), teal accent tick above it.
const lockupTop = Math.round((HEIGHT - lockupHeight) / 2) - 48;
const taglineY = lockupTop + lockupHeight + 96;

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="#101B30"/>
      <stop offset="70%" stop-color="#0B1220"/>
      <stop offset="100%" stop-color="#070D17"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="${WIDTH / 2 - 60}" y="${taglineY - 44}" width="120" height="4" rx="2" fill="#2DD4BF"/>
  <text x="${WIDTH / 2}" y="${taglineY}" text-anchor="middle"
    font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="34"
    font-weight="500" fill="#E8ECF5">${tagline}</text>
</svg>`;

const banner = await sharp(Buffer.from(svg))
  .composite([{ input: lockup, left: Math.round((WIDTH - LOCKUP_WIDTH) / 2), top: lockupTop }])
  .png()
  .toBuffer();

await sharp(banner).toFile('brand/banner.png');
await sharp(banner).toFile('public/banner.png');
console.log('wrote brand/banner.png and public/banner.png');
