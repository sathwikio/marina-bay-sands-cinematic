import * as THREE from 'three';
import { createWindowTexture } from '../assets/textures';

export class BackgroundSkyline {
  public group: THREE.Group;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    const winTexture = createWindowTexture();

    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x182430,
      roughness: 0.25,
      metalness: 0.75,
      map: winTexture
    });

    const glassTowerMat = new THREE.MeshStandardMaterial({
      color: 0x223a4d,
      roughness: 0.15,
      metalness: 0.85
    });

    const crownLightMat = new THREE.MeshBasicMaterial({
      color: 0xffd27d
    });

    // Singapore CBD Towers cluster (across the bay on the west / north-west side: x in [-700, -500], z in [-350, 350])
    const towerConfigs = [
      // Central cluster (Raffles Place / Marina Bay Financial Centre)
      { x: -580, z: -40,  w: 42, d: 42, h: 280 }, // UOB Plaza 1
      { x: -630, z: 20,   w: 38, d: 38, h: 260 }, // One Raffles Place
      { x: -550, z: -110, w: 45, d: 40, h: 245 }, // Republic Plaza
      { x: -510, z: 80,   w: 50, d: 35, h: 225 }, // MBFC Tower 1
      { x: -540, z: 140,  w: 48, d: 38, h: 240 }, // MBFC Tower 2
      { x: -480, z: 190,  w: 44, d: 44, h: 210 }, // MBFC Tower 3
      { x: -620, z: -170, w: 35, d: 35, h: 195 }, // OCBC Centre
      { x: -590, z: -230, w: 40, d: 40, h: 180 }, // Fullerton / Raffles
      { x: -530, z: -280, w: 36, d: 36, h: 165 }, // Boat Quay towers
      { x: -470, z: -80,  w: 38, d: 32, h: 190 }, // Custom House / OUE Bayfront
      { x: -490, z: -20,  w: 34, d: 34, h: 175 }, // One Marina Boulevard
      { x: -660, z: -90,  w: 45, d: 45, h: 220 }, // Shenton Way
      { x: -680, z: 70,   w: 40, d: 40, h: 205 }, // Tanjong Pagar
      { x: -570, z: 260,  w: 55, d: 45, h: 170 }, // Marina South
      { x: -620, z: 210,  w: 38, d: 38, h: 185 }, // Asia Square Tower 1
      { x: -660, z: 270,  w: 40, d: 40, h: 200 }, // Asia Square Tower 2
      // Northern perimeter (Suntec City / Marina Centre)
      { x: -280, z: -460, w: 45, d: 45, h: 180 }, // Suntec Tower 1
      { x: -220, z: -480, w: 45, d: 45, h: 180 }, // Suntec Tower 2
      { x: -160, z: -510, w: 40, d: 40, h: 160 }, // Millenia Tower
      { x: -110, z: -450, w: 38, d: 38, h: 150 }, // Centennial Tower
      { x: -320, z: -400, w: 50, d: 35, h: 140 }  // Pan Pacific / Marina Square
    ];

    towerConfigs.forEach(cfg => {
      // Main body
      const geo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      const isGlass = Math.random() > 0.6;
      const mesh = new THREE.Mesh(geo, isGlass ? glassTowerMat : buildingMat);
      mesh.position.set(cfg.x, cfg.h / 2, cfg.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);

      // Architectural Crown / Helipad / Spire
      if (cfg.h > 210) {
        const crownGeo = new THREE.BoxGeometry(cfg.w * 0.7, 8, cfg.d * 0.7);
        const crown = new THREE.Mesh(crownGeo, crownLightMat);
        crown.position.set(cfg.x, cfg.h + 4, cfg.z);
        this.group.add(crown);

        // Antenna Spire
        const spireGeo = new THREE.CylinderGeometry(0.5, 1.2, 25, 8);
        const spireMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.9, roughness: 0.2 });
        const spire = new THREE.Mesh(spireGeo, spireMat);
        spire.position.set(cfg.x, cfg.h + 20, cfg.z);
        this.group.add(spire);
      }
    });

    scene.add(this.group);
  }
}
