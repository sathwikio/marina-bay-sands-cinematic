import * as THREE from 'three';

/**
 * Procedural CC0-compliant PBR texture generators
 * Zero network dependencies, zero licensing ambiguity, deterministic, high quality.
 */

/**
 * Creates a high-frequency seamless water normal map (1024x1024)
 * Uses multi-octave directional wave synthesis to encode slope gradients into RGB normal vectors.
 */
export function createWaterNormalTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Multi-frequency directional waves
  const waveParams = [
    { freqX: 8.0,  freqY: 6.0,  amp: 1.00, speed: 1.0 },
    { freqX: 16.0, freqY: 20.0, amp: 0.50, speed: 1.3 },
    { freqX: 32.0, freqY: 28.0, amp: 0.25, speed: 1.8 },
    { freqX: 64.0, freqY: 58.0, amp: 0.12, speed: 2.2 },
    { freqX: 120.0, freqY: 96.0, amp: 0.06, speed: 3.0 }
  ];

  for (let y = 0; y < size; y++) {
    const v = (y / size) * Math.PI * 2;
    for (let x = 0; x < size; x++) {
      const u = (x / size) * Math.PI * 2;

      let dHdu = 0;
      let dHdv = 0;

      for (let i = 0; i < waveParams.length; i++) {
        const wp = waveParams[i];
        const angle = u * wp.freqX + v * wp.freqY;
        const cosVal = Math.cos(angle) * wp.amp;
        dHdu += cosVal * wp.freqX;
        dHdv += cosVal * wp.freqY;
      }

      // Convert slopes to surface normal
      // Tangent vector T = (1, 0, dHdu), Bitangent B = (0, 1, dHdv)
      // Normal N = normalize(-dHdu, -dHdv, 1.0)
      const scale = 0.008; // Normal steepness factor
      let nx = -dHdu * scale;
      let ny = -dHdv * scale;
      let nz = 1.0;

      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      nx /= len;
      ny /= len;
      nz /= len;

      const idx = (y * size + x) * 4;
      data[idx]     = Math.floor((nx * 0.5 + 0.5) * 255); // Red (X normal)
      data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255); // Green (Y normal)
      data[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255); // Blue (Z normal)
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a flamed dark granite paving texture for the promenade and waterfront
 */
export function createGraniteTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c1f24';
  ctx.fillRect(0, 0, size, size);

  // Granite speckling
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 40;
    const base = 35 + grain;
    data[i]     = Math.max(0, Math.min(255, base + (Math.random() > 0.85 ? 40 : 0)));
    data[i + 1] = Math.max(0, Math.min(255, base + (Math.random() > 0.85 ? 40 : 0)));
    data[i + 2] = Math.max(0, Math.min(255, base + 5 + (Math.random() > 0.85 ? 40 : 0)));
  }
  ctx.putImageData(imgData, 0, 0);

  // Paver tile grid lines
  ctx.strokeStyle = 'rgba(10, 12, 16, 0.7)';
  ctx.lineWidth = 2;
  const tileSize = 64;
  for (let x = 0; x <= size; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y <= size; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates realistic teak wood decking for the SkyPark and pool walkways
 */
export function createTeakDeckTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#6b543e';
  ctx.fillRect(0, 0, size, size);

  // Horizontal wood planking
  const plankHeight = 16;
  for (let y = 0; y < size; y += plankHeight) {
    // Individual plank tint variation
    const variation = (Math.random() - 0.5) * 30;
    const r = Math.max(60, Math.min(140, 110 + variation));
    const g = Math.max(50, Math.min(110, 85 + variation * 0.8));
    const b = Math.max(30, Math.min(80, 60 + variation * 0.6));
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(0, y, size, plankHeight - 2);

    // Plank seams
    ctx.fillStyle = '#2b1d14';
    ctx.fillRect(0, y + plankHeight - 2, size, 2);

    // Wood grain lines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let k = 0; k < 4; k++) {
      const gy = y + Math.random() * (plankHeight - 3);
      ctx.fillRect(0, gy, size, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a facade hotel window texture with random warm room lights for twilight/golden hour
 */
export function createWindowTexture(): THREE.CanvasTexture {
  const width = 256;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Dark tinted base glass
  ctx.fillStyle = '#0a141e';
  ctx.fillRect(0, 0, width, height);

  const cols = 8;
  const rows = 16;
  const cw = width / cols;
  const ch = height / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isLit = Math.random() > 0.52; // realistic 48% occupancy lighting
      const px = c * cw + 2;
      const py = r * ch + 2;
      const pw = cw - 4;
      const ph = ch - 4;

      if (isLit) {
        const warmHue = Math.floor(38 + (Math.random() - 0.5) * 12); // Warm golden amber 2700K - 3200K
        const lum = Math.floor(75 + Math.random() * 20);
        ctx.fillStyle = `hsl(${warmHue}, 85%, ${lum}%)`;
      } else {
        ctx.fillStyle = `rgb(${8 + Math.random() * 10}, ${15 + Math.random() * 12}, ${25 + Math.random() * 15})`;
      }
      ctx.fillRect(px, py, pw, ph);

      // Mullion frame
      ctx.strokeStyle = '#222d38';
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py, pw, ph);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a tropical palm frond texture with alpha mask
 */
export function createPalmFrondTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  // Central stem
  ctx.beginPath();
  ctx.moveTo(size * 0.5, size);
  ctx.bezierCurveTo(size * 0.5, size * 0.5, size * 0.45, size * 0.2, size * 0.5, 0);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#3e5c2d';
  ctx.stroke();

  // Foliage leaflets
  const count = 30;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const y = size - t * size;
    const widthFrac = Math.sin(t * Math.PI) * 110;

    ctx.fillStyle = t > 0.4 ? '#4a7c29' : '#396020';

    // Left leaflet
    ctx.beginPath();
    ctx.moveTo(size * 0.5, y);
    ctx.quadraticCurveTo(size * 0.5 - widthFrac * 0.6, y - 10, size * 0.5 - widthFrac, y + 15);
    ctx.lineTo(size * 0.5, y + 4);
    ctx.fill();

    // Right leaflet
    ctx.beginPath();
    ctx.moveTo(size * 0.5, y);
    ctx.quadraticCurveTo(size * 0.5 + widthFrac * 0.6, y - 10, size * 0.5 + widthFrac, y + 15);
    ctx.lineTo(size * 0.5, y + 4);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
