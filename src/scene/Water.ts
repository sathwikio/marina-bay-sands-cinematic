import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { createWaterNormalTexture } from '../assets/textures';

export class MarinaBayWater {
  public mesh: Water | THREE.Mesh;
  private waterNormals: THREE.Texture;
  private timeUniform: { value: number } | null = null;

  constructor(scene: THREE.Scene, sunDirection: THREE.Vector3) {
    const waterGeometry = new THREE.PlaneGeometry(2400, 2400, 64, 64);
    this.waterNormals = createWaterNormalTexture();

    try {
      const water = new Water(waterGeometry, {
        textureWidth: 1024,
        textureHeight: 1024,
        waterNormals: this.waterNormals,
        sunDirection: sunDirection.clone().normalize(),
        sunColor: 0xffe0a8,
        waterColor: 0x051a24,
        distortionScale: 3.2,
        fog: scene.fog !== undefined
      });

      water.rotation.x = -Math.PI / 2;
      water.position.y = 0.0;
      water.receiveShadow = true;
      scene.add(water);

      this.mesh = water;
      this.timeUniform = water.material.uniforms['time'];
    } catch (err) {
      console.warn('Falling back to standard PBR water plane:', err);
      // Fallback PBR water
      const waterMat = new THREE.MeshStandardMaterial({
        color: 0x071e2b,
        roughness: 0.12,
        metalness: 0.85,
        normalMap: this.waterNormals,
        normalScale: new THREE.Vector2(0.3, 0.3)
      });
      const mesh = new THREE.Mesh(waterGeometry, waterMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 0.0;
      mesh.receiveShadow = true;
      scene.add(mesh);
      this.mesh = mesh;
    }
  }

  public update(delta: number): void {
    if (this.timeUniform) {
      this.timeUniform.value += delta * 0.45;
    }
    if (this.waterNormals) {
      this.waterNormals.offset.x += delta * 0.015;
      this.waterNormals.offset.y += delta * 0.008;
    }
  }
}
