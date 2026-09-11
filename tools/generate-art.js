/**
 * Procedural artwork pipeline: every plate, the avatar and the icon set,
 * rendered here and written as PNGs with a small dependency-free encoder.
 *
 *   node tools/generate-art.js
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/* ------------------------------------------------------------------ *
 * PNG encoder (no dependencies)
 * ------------------------------------------------------------------ */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typed = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typed));
  return Buffer.concat([length, typed, crc]);
}

/**
 * Per-scanline filter selection (None / Sub / Up) using the standard
 * minimum-sum-of-absolute-differences heuristic. Smooth gradients compress
 * several times better than storing unfiltered scanlines.
 */
function filterScanlines(pixels, width, height, channels) {
  const stride = width * channels;
  const out = Buffer.alloc((stride + 1) * height);
  const sub = Buffer.alloc(stride);
  const up = Buffer.alloc(stride);

  for (let y = 0; y < height; y++) {
    const row = y * stride;
    const prev = row - stride;
    let sumNone = 0;
    let sumSub = 0;
    let sumUp = 0;

    for (let i = 0; i < stride; i++) {
      const raw = pixels[row + i];
      const left = i >= channels ? pixels[row + i - channels] : 0;
      const above = y > 0 ? pixels[prev + i] : 0;
      const s = (raw - left) & 0xff;
      const u = (raw - above) & 0xff;
      sub[i] = s;
      up[i] = u;
      sumNone += raw < 128 ? raw : 256 - raw;
      sumSub += s < 128 ? s : 256 - s;
      sumUp += u < 128 ? u : 256 - u;
    }

    const dest = y * (stride + 1);
    if (sumSub <= sumNone && sumSub <= sumUp) {
      out[dest] = 1;
      sub.copy(out, dest + 1);
    } else if (sumUp <= sumNone) {
      out[dest] = 2;
      up.copy(out, dest + 1);
    } else {
      out[dest] = 0;
      pixels.copy(out, dest + 1, row, row + stride);
    }
  }
  return out;
}

function writePNG(file, width, height, pixels, channels) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = channels === 4 ? 6 : 2; // RGBA / RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(filterScanlines(pixels, width, height, channels), { level: 9 });
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, png);
  return png.length;
}

/* ------------------------------------------------------------------ *
 * Math helpers
 * ------------------------------------------------------------------ */

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const mix = (a, b, t) => a + (b - a) * t;

function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hex(value) {
  return [
    parseInt(value.slice(1, 3), 16) / 255,
    parseInt(value.slice(3, 5), 16) / 255,
    parseInt(value.slice(5, 7), 16) / 255,
  ];
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ *
 * Renderer
 *
 * Each plate is a stack of light operations evaluated per sample:
 *   gradient -> occluders (arch / bands) -> light (shafts, glow, aperture)
 *   -> vignette -> grain
 * Shapes are supersampled; grain deliberately is not, so it stays crisp.
 * ------------------------------------------------------------------ */

function renderPlate(spec) {
  const {
    width,
    height,
    samples = 2,
    top,
    bottom,
    warp = 0.05,
    arch = null,
    bands = [],
    shafts = [],
    glow = null,
    aperture = null,
    vignette = 0.35,
    grain = 0.035,
    seed = 1,
  } = spec;

  const topColor = hex(top);
  const bottomColor = hex(bottom);
  const aspect = height / width;
  const pixels = Buffer.alloc(width * height * 3);
  const random = mulberry32(seed);
  const acc = [0, 0, 0];
  const sample = [0, 0, 0];

  const shade = (px, py, out) => {
    // Base gradient, gently warped so the horizon never reads as a flat band.
    const t = clamp01(py + warp * Math.sin(px * 3.1 + 0.6) * (1 - py));
    const e = smoothstep(0, 1, t);
    out[0] = mix(topColor[0], bottomColor[0], e);
    out[1] = mix(topColor[1], bottomColor[1], e);
    out[2] = mix(topColor[2], bottomColor[2], e);

    // Occluding tonal bands (stair treads, wall planes).
    for (const band of bands) {
      const ca = Math.cos(band.angle);
      const sa = Math.sin(band.angle);
      const u = (px - 0.5) * ca + (py - 0.5) * sa;
      const d = Math.abs(u - band.pos);
      const m = 1 - smoothstep(band.width * 0.5, band.width * 0.5 + (band.soft || 0.004), d);
      if (m > 0) {
        const k = 1 + (band.tone - 1) * m;
        out[0] *= k;
        out[1] *= k;
        out[2] *= k;
      }
    }

    // Architectural silhouette: a doorway the light falls through.
    if (arch) {
      const half = arch.width * 0.5;
      const yy = py * aspect;
      const ayy = arch.springLine * aspect;
      let d;
      if (yy > ayy) {
        d = half - Math.abs(px - arch.x);
      } else {
        const dx = px - arch.x;
        const dy = yy - ayy;
        d = half - Math.sqrt(dx * dx + dy * dy);
      }
      const inside = smoothstep(-0.0025, 0.0025, d) * smoothstep(arch.base + 0.02, arch.base - 0.02, py);
      if (inside > 0) {
        const tint = hex(arch.tint);
        out[0] = mix(out[0], tint[0], inside * arch.strength);
        out[1] = mix(out[1], tint[1], inside * arch.strength);
        out[2] = mix(out[2], tint[2], inside * arch.strength);
      }
    }

    // Light shafts: a soft band in rotated space, fading along its length.
    for (const shaft of shafts) {
      const ca = Math.cos(shaft.angle);
      const sa = Math.sin(shaft.angle);
      const u = (px - 0.5) * ca + (py - 0.5) * sa;
      const v = -(px - 0.5) * sa + (py - 0.5) * ca;
      const d = Math.abs(u - shaft.pos);
      const band = 1 - smoothstep(shaft.width * 0.5, shaft.width * 0.5 + shaft.soft, d);
      if (band <= 0) continue;
      const along = 1 - smoothstep(shaft.fadeFrom, shaft.fadeTo, v);
      const amount = shaft.intensity * band * along;
      if (amount <= 0) continue;
      const color = hex(shaft.color);
      out[0] += color[0] * amount;
      out[1] += color[1] * amount;
      out[2] += color[2] * amount;
    }

    // Radial bloom.
    if (glow) {
      const dx = px - glow.x;
      const dy = (py - glow.y) * aspect;
      const falloff = 1 - smoothstep(0, glow.radius, Math.sqrt(dx * dx + dy * dy));
      const amount = falloff * falloff * glow.intensity;
      const color = hex(glow.color);
      out[0] += color[0] * amount;
      out[1] += color[1] * amount;
      out[2] += color[2] * amount;
    }

    // Blown-out aperture with surrounding bloom.
    if (aperture) {
      const color = hex(aperture.color);
      const core =
        (1 - smoothstep(aperture.width * 0.5, aperture.width * 0.5 + 0.01, Math.abs(px - aperture.x))) *
        (1 - smoothstep(aperture.height * 0.5, aperture.height * 0.5 + 0.01, Math.abs(py - aperture.y)));
      const halo =
        (1 - smoothstep(aperture.width * 0.5, aperture.width * 0.5 + 0.22, Math.abs(px - aperture.x))) *
        (1 - smoothstep(aperture.height * 0.5, aperture.height * 0.5 + 0.3, Math.abs(py - aperture.y)));
      const amount = core * aperture.intensity + halo * aperture.intensity * 0.3;
      out[0] += color[0] * amount;
      out[1] += color[1] * amount;
      out[2] += color[2] * amount;
    }
  };

  // Grain is generated per 2x2 block rather than per pixel: it still breaks up
  // 8-bit gradient banding, but keeps the encoded PNG about a third of the size.
  const blockW = Math.ceil(width / 2);
  const noiseMap = new Float32Array(blockW * Math.ceil(height / 2));
  for (let i = 0; i < noiseMap.length; i++) noiseMap[i] = (random() - 0.5) * grain;

  const inv = 1 / (samples * samples);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      acc[0] = 0;
      acc[1] = 0;
      acc[2] = 0;
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          shade((x + (sx + 0.5) / samples) / width, (y + (sy + 0.5) / samples) / height, sample);
          acc[0] += sample[0];
          acc[1] += sample[1];
          acc[2] += sample[2];
        }
      }

      const nx = (x / width - 0.5) * 2;
      const ny = (y / height - 0.5) * 2;
      const corner = 1 - vignette * clamp01((nx * nx + ny * ny) * 0.55);
      const noise = noiseMap[(y >> 1) * blockW + (x >> 1)];

      const i = (y * width + x) * 3;
      for (let c = 0; c < 3; c++) {
        pixels[i + c] = Math.round(clamp01(acc[c] * inv * corner + noise) * 255);
      }
    }
  }

  return pixels;
}

/* ------------------------------------------------------------------ *
 * Plates - six light studies, one per journal entry
 * ------------------------------------------------------------------ */

const W = 880;
const H = 1144;

const PLATES = {
  'plate-first-light': {
    width: W,
    height: H,
    seed: 7,
    top: '#2A1B14',
    bottom: '#0E0A08',
    arch: { x: 0.46, width: 0.44, springLine: 0.44, base: 1.0, tint: '#120C09', strength: 0.55 },
    shafts: [
      { angle: -0.42, pos: -0.12, width: 0.1, soft: 0.16, intensity: 0.85, color: '#FFB65C', fadeFrom: 0.05, fadeTo: 0.62 },
      { angle: -0.42, pos: 0.06, width: 0.05, soft: 0.12, intensity: 0.5, color: '#FFD79A', fadeFrom: 0.0, fadeTo: 0.5 },
    ],
    glow: { x: 0.3, y: 0.16, radius: 0.55, color: '#FF9E3D', intensity: 0.42 },
    vignette: 0.5,
    grain: 0.04,
  },
  'plate-concrete-noon': {
    width: W,
    height: H,
    seed: 19,
    top: '#9AA3A8',
    bottom: '#4E585F',
    bands: [
      { angle: 0, pos: -0.34, width: 0.1, tone: 0.74 },
      { angle: 0, pos: -0.12, width: 0.07, tone: 0.82 },
      { angle: 0, pos: 0.16, width: 0.12, tone: 0.7 },
      { angle: 0, pos: 0.4, width: 0.08, tone: 0.86 },
    ],
    shafts: [
      { angle: 0.08, pos: 0.02, width: 0.26, soft: 0.1, intensity: 0.5, color: '#FFFFFF', fadeFrom: -0.2, fadeTo: 0.55 },
    ],
    vignette: 0.42,
    grain: 0.045,
  },
  'plate-terracotta-stair': {
    width: W,
    height: H,
    seed: 33,
    top: '#E08A55',
    bottom: '#7A2E1C',
    bands: [
      { angle: 1.05, pos: -0.3, width: 0.09, tone: 0.78, soft: 0.002 },
      { angle: 1.05, pos: -0.14, width: 0.09, tone: 0.9, soft: 0.002 },
      { angle: 1.05, pos: 0.02, width: 0.09, tone: 0.72, soft: 0.002 },
      { angle: 1.05, pos: 0.18, width: 0.09, tone: 0.86, soft: 0.002 },
      { angle: 1.05, pos: 0.34, width: 0.09, tone: 0.68, soft: 0.002 },
    ],
    shafts: [
      { angle: -0.9, pos: -0.1, width: 0.16, soft: 0.2, intensity: 0.55, color: '#FFD9A8', fadeFrom: -0.1, fadeTo: 0.6 },
    ],
    vignette: 0.44,
    grain: 0.05,
  },
  'plate-blue-hour': {
    width: W,
    height: H,
    seed: 51,
    top: '#243A63',
    bottom: '#0B1020',
    warp: 0.02,
    bands: [{ angle: 1.5708, pos: 0.22, width: 0.5, tone: 0.55, soft: 0.01 }],
    glow: { x: 0.68, y: 0.3, radius: 0.42, color: '#FFC48A', intensity: 0.85 },
    shafts: [
      { angle: 0, pos: 0.18, width: 0.012, soft: 0.05, intensity: 0.35, color: '#FFE7C8', fadeFrom: 0.1, fadeTo: 0.45 },
    ],
    vignette: 0.5,
    grain: 0.04,
  },
  'plate-atrium': {
    width: W,
    height: H,
    seed: 71,
    top: '#F2EEE2',
    bottom: '#BFC4B2',
    arch: { x: 0.52, width: 0.56, springLine: 0.5, base: 1.0, tint: '#8E9683', strength: 0.32 },
    shafts: [
      { angle: -0.22, pos: -0.2, width: 0.2, soft: 0.2, intensity: 0.34, color: '#FFFFFF', fadeFrom: 0.0, fadeTo: 0.7 },
      { angle: -0.22, pos: 0.22, width: 0.12, soft: 0.18, intensity: 0.26, color: '#FFF6E0', fadeFrom: 0.0, fadeTo: 0.7 },
    ],
    vignette: 0.3,
    grain: 0.03,
  },
  'plate-ember-window': {
    width: W,
    height: H,
    seed: 97,
    top: '#1A1713',
    bottom: '#080706',
    warp: 0.01,
    aperture: { x: 0.5, y: 0.4, width: 0.3, height: 0.34, color: '#FF8A3C', intensity: 1.25 },
    bands: [{ angle: 0, pos: 0.0, width: 0.008, tone: 0.35, soft: 0.003 }],
    vignette: 0.55,
    grain: 0.04,
  },
};

/* ------------------------------------------------------------------ *
 * Identity - avatar and the icon set
 * ------------------------------------------------------------------ */

function renderAvatar(size) {
  const pixels = Buffer.alloc(size * size * 3);
  const base = hex('#2A1B14');
  const warm = hex('#E8A15C');
  const ember = hex('#C2562F');
  const random = mulberry32(404);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x / size;
      const py = y / size;
      const d = Math.sqrt((px - 0.36) ** 2 + (py - 0.3) ** 2);
      const core = 1 - smoothstep(0, 0.72, d);
      const rim = 1 - smoothstep(0.42, 0.95, Math.sqrt((px - 0.7) ** 2 + (py - 0.82) ** 2));
      const noise = (random() - 0.5) * 0.03;
      const i = (y * size + x) * 3;
      for (let c = 0; c < 3; c++) {
        const v = mix(base[c], warm[c], core * core) + ember[c] * rim * 0.35 + noise;
        pixels[i + c] = Math.round(clamp01(v) * 255);
      }
    }
  }
  return pixels;
}

/**
 * The Lumen mark: a keyhole arch with a slot of light cut through it.
 * `paint` receives coverage 0..1 and returns [r, g, b, a] in 0..1.
 */
function renderMark(size, paint, background) {
  const channels = background ? 3 : 4;
  const pixels = Buffer.alloc(size * size * channels);
  const px1 = 1 / size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let coverage = 0;
      for (let sy = 0; sy < 3; sy++) {
        for (let sx = 0; sx < 3; sx++) {
          const px = (x + (sx + 0.5) / 3) / size;
          const py = (y + (sy + 0.5) / 3) / size;
          const half = 0.16;
          const spring = 0.44;
          const d = py > spring ? half - Math.abs(px - 0.5) : half - Math.hypot(px - 0.5, py - spring);
          const body = smoothstep(-px1, px1, d) * smoothstep(0.74 + px1, 0.74 - px1, py);
          const slot =
            smoothstep(-px1, px1, 0.045 - Math.abs(px - 0.5)) *
            smoothstep(0.3 - px1, 0.3 + px1, py) *
            smoothstep(0.66 + px1, 0.66 - px1, py);
          coverage += Math.max(0, body - slot);
        }
      }
      coverage /= 9;

      const [r, g, b, a] = paint(coverage, x / size, y / size);
      const i = (y * size + x) * channels;
      if (background) {
        // Ordered dither: without it the icon's radial glow banks into rings.
        const d = (((x & 1) ^ (y & 1)) - 0.5) / 255;
        pixels[i] = Math.round(clamp01(mix(background[0], r, a) + d) * 255);
        pixels[i + 1] = Math.round(clamp01(mix(background[1], g, a) + d) * 255);
        pixels[i + 2] = Math.round(clamp01(mix(background[2], b, a) + d) * 255);
      } else {
        pixels[i] = Math.round(clamp01(r) * 255);
        pixels[i + 1] = Math.round(clamp01(g) * 255);
        pixels[i + 2] = Math.round(clamp01(b) * 255);
        pixels[i + 3] = Math.round(clamp01(a) * 255);
      }
    }
  }
  return { pixels, channels };
}

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

const root = path.resolve(__dirname, '..');
const artDir = path.join(root, 'assets', 'art');
const assetDir = path.join(root, 'assets');
let total = 0;

function report(file, bytes) {
  total += bytes;
  console.log('  ' + path.relative(root, file).padEnd(42) + (bytes / 1024).toFixed(0).padStart(5) + ' KB');
}

console.log('\nLumen - procedural artwork\n');

for (const [name, spec] of Object.entries(PLATES)) {
  const file = path.join(artDir, name + '.png');
  report(file, writePNG(file, spec.width, spec.height, renderPlate(spec), 3));
}

const avatarFile = path.join(artDir, 'avatar.png');
report(avatarFile, writePNG(avatarFile, 320, 320, renderAvatar(320), 3));

const ember = hex('#E8873F');
const ink = hex('#12100E');
const paper = hex('#FBF7F0');

// App icon: ember mark on ink, opaque.
{
  const { pixels, channels } = renderMark(
    1024,
    (c, x, y) => {
      const glow = (1 - smoothstep(0, 0.6, Math.hypot(x - 0.5, y - 0.42))) * 0.22;
      return [mix(ember[0], 1, 0.15), ember[1], ember[2], Math.max(c, glow * 0.35)];
    },
    ink
  );
  const file = path.join(assetDir, 'icon.png');
  report(file, writePNG(file, 1024, 1024, pixels, channels));
}

// Android adaptive foreground: mark only, transparent, inside the safe zone.
{
  const { pixels, channels } = renderMark(1024, (c) => [ember[0], ember[1], ember[2], c]);
  const file = path.join(assetDir, 'android-icon-foreground.png');
  report(file, writePNG(file, 1024, 1024, pixels, channels));
}

// Android adaptive background: flat ink.
{
  const size = 1024;
  const pixels = Buffer.alloc(size * size * 3);
  for (let i = 0; i < size * size; i++) {
    pixels[i * 3] = Math.round(ink[0] * 255);
    pixels[i * 3 + 1] = Math.round(ink[1] * 255);
    pixels[i * 3 + 2] = Math.round(ink[2] * 255);
  }
  const file = path.join(assetDir, 'android-icon-background.png');
  report(file, writePNG(file, size, size, pixels, 3));
}

// Android monochrome: white mark, the system tints it.
{
  const { pixels, channels } = renderMark(1024, (c) => [1, 1, 1, c]);
  const file = path.join(assetDir, 'android-icon-monochrome.png');
  report(file, writePNG(file, 1024, 1024, pixels, channels));
}

// Favicon.
{
  const { pixels, channels } = renderMark(64, (c) => [ember[0], ember[1], ember[2], c], ink);
  const file = path.join(assetDir, 'favicon.png');
  report(file, writePNG(file, 64, 64, pixels, channels));
}

// Splash mark on paper.
{
  const { pixels, channels } = renderMark(512, (c) => [ember[0], ember[1], ember[2], c], paper);
  const file = path.join(assetDir, 'splash-icon.png');
  report(file, writePNG(file, 512, 512, pixels, channels));
}

console.log('\n  total ' + (total / 1024).toFixed(0) + ' KB\n');
