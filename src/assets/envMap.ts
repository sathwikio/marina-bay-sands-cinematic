import * as THREE from 'three';

/**
 * Creates a physically-calibrated tropical Singapore golden-hour environment map
 * Zenith: Tropical dusk indigo/blue
 * Horizon: Warm golden/amber sunset glow
 * Nadir: Deep reflective bay water
 */
export function createArchitecturalEnvironmentMap(renderer: THREE.WebGLRenderer): THREE.Texture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size * 2;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Equirectangular gradient: Y = 0 is zenith, Y = size/2 is horizon, Y = size is ground
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0.00, '#122b46'); // Deep zenith blue
  grad.addColorStop(0.35, '#285885'); // Mid-sky azure
  grad.addColorStop(0.48, '#e08f43'); // Sunset orange horizon band
  grad.addColorStop(0.52, '#ffcd85'); // Bright golden sun azimuth
  grad.addColorStop(0.58, '#2a3a48'); // Distant bay shoreline
  grad.addColorStop(0.75, '#0d1a24'); // Tropical bay water
  grad.addColorStop(1.00, '#040b10'); // Deep nadir

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Soft sunset sun disc at horizon
  const sunX = canvas.width * 0.65;
  const sunY = size * 0.50;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 120);
  sunGrad.addColorStop(0.0, 'rgba(255, 250, 220, 1.0)');
  sunGrad.addColorStop(0.2, 'rgba(255, 200, 120, 0.8)');
  sunGrad.addColorStop(0.6, 'rgba(230, 120, 50, 0.3)');
  sunGrad.addColorStop(1.0, 'rgba(200, 80, 30, 0.0)');
  ctx.fillStyle = sunGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const renderTarget = pmremGenerator.fromEquirectangular(texture);
  texture.dispose();
  pmremGenerator.dispose();

  return renderTarget.texture;
}
