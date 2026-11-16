import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPNG(width, height, drawFn) {
  // RGBA buffer with 1 byte filter per scanline
  const rowSize = width * 4;
  const rawData = Buffer.alloc((rowSize + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression method
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace method

  function createChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    // CRC32 calculation
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 implementation
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Icon drawer: Draw stylish NaijaSkits branding
function drawIcon(x, y, w, h, isMaskable = false) {
  const nx = x / w;
  const ny = y / h;

  // Background deep gradient: dark slate to indigo & emerald
  const bgR = Math.round(15 + nx * 10 + ny * 5);
  const bgG = Math.round(23 + nx * 20 + ny * 25);
  const bgB = Math.round(42 - nx * 15 + ny * 10);

  // Center coordinate
  const cx = 0.5;
  const cy = 0.5;
  const dx = nx - cx;
  const dy = ny - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Outer circle border
  const circleRadius = isMaskable ? 0.38 : 0.44;
  if (Math.abs(dist - circleRadius) < 0.015) {
    return [16, 185, 129, 255]; // emerald ring
  }

  // Clapperboard bar at top
  const clapY = isMaskable ? 0.28 : 0.25;
  if (ny > clapY && ny < clapY + 0.07 && Math.abs(dx) < 0.26) {
    // Alternating stripes (emerald & amber)
    const stripe = Math.floor((nx + ny) * 20) % 2 === 0;
    if (stripe) {
      return [16, 185, 129, 255]; // emerald
    } else {
      return [245, 158, 11, 255]; // amber/gold
    }
  }

  // Stick figure head
  const headY = isMaskable ? 0.44 : 0.42;
  const headDist = Math.sqrt(dx * dx + (ny - headY) * (ny - headY));
  if (headDist < 0.075) {
    // Face outline vs inside
    if (headDist > 0.06) {
      return [245, 158, 11, 255]; // amber outline
    }
    // Eyes
    if (Math.abs(ny - (headY - 0.015)) < 0.012 && (Math.abs(dx - 0.025) < 0.008 || Math.abs(dx + 0.025) < 0.008)) {
      return [15, 23, 42, 255];
    }
    // Smile
    if (ny > headY + 0.01 && ny < headY + 0.035 && Math.abs(dx) < 0.03) {
      return [15, 23, 42, 255];
    }
    return [254, 240, 138, 255]; // bright yellow face
  }

  // Stick figure body (line)
  const bodyTop = headY + 0.075;
  const bodyBottom = isMaskable ? 0.65 : 0.66;
  if (ny >= bodyTop && ny <= bodyBottom && Math.abs(dx) < 0.015) {
    return [56, 189, 248, 255]; // sky blue spine
  }

  // Stick arms
  const armY = headY + 0.11;
  const armSlopeL = (dx + 0.02) * 0.8 + (ny - armY);
  if (dx < 0 && dx > -0.16 && Math.abs(armSlopeL) < 0.016 && ny > armY - 0.08 && ny < armY + 0.05) {
    return [245, 158, 11, 255];
  }
  const armSlopeR = -(dx - 0.02) * 0.8 + (ny - armY);
  if (dx > 0 && dx < 0.16 && Math.abs(armSlopeR) < 0.016 && ny > armY - 0.08 && ny < armY + 0.05) {
    return [16, 185, 129, 255];
  }

  // Stick legs
  const legY = bodyBottom;
  const legSlopeL = (dx + 0.02) * 1.3 - (ny - legY);
  if (dx < 0 && dx > -0.15 && Math.abs(legSlopeL) < 0.018 && ny >= legY && ny < legY + 0.18) {
    return [56, 189, 248, 255];
  }
  const legSlopeR = -(dx - 0.02) * 1.3 - (ny - legY);
  if (dx > 0 && dx < 0.15 && Math.abs(legSlopeR) < 0.018 && ny >= legY && ny < legY + 0.18) {
    return [56, 189, 248, 255];
  }

  // Soundwaves on right side
  if (dx > 0.18 && dx < 0.38 && Math.abs(ny - 0.44) < 0.18) {
    const waveDist = Math.sqrt((dx - 0.18) * (dx - 0.18) + (ny - 0.44) * (ny - 0.44));
    if (Math.abs(waveDist - 0.06) < 0.01 || Math.abs(waveDist - 0.12) < 0.01 || Math.abs(waveDist - 0.17) < 0.01) {
      return [16, 185, 129, 220]; // emerald soundwave
    }
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA icons...');
const icon192 = createPNG(192, 192, (x, y, w, h) => drawIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), icon192);

const icon512 = createPNG(512, 512, (x, y, w, h) => drawIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), icon512);

const iconMaskable = createPNG(512, 512, (x, y, w, h) => drawIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), iconMaskable);

const appleIcon = createPNG(180, 180, (x, y, w, h) => drawIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

// Favicon ico: save 32x32 png as favicon.ico (browsers accept PNG-encoded .ico)
const faviconPNG = createPNG(32, 32, (x, y, w, h) => drawIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconPNG);

console.log('All PWA icons generated successfully in public/');
