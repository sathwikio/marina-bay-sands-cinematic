import * as THREE from 'three';
import { createPalmFrondTexture } from '../assets/textures';

export class LandscapingBuilder {
  public group: THREE.Group;
  private palmFrondTexture: THREE.Texture;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.palmFrondTexture = createPalmFrondTexture();

    this.buildSkyParkPalmGroves();
    this.buildPromenadePalmWalk();

    scene.add(this.group);
  }

  /**
   * Instanced tropical palm trees on the Sands SkyPark
   */
  private buildSkyParkPalmGroves(): void {
    const palmModel = this.createPalmTreeModel(5.5);

    // Positions along the SkyPark central walkway (z from -150 to +110)
    const skyparkPalmPositions: THREE.Vector3[] = [];
    for (let z = -140; z <= 100; z += 14) {
      // East side of planter
      skyparkPalmPositions.push(new THREE.Vector3(5.5, 200.6, z + (Math.random() - 0.5) * 3));
      // West side near pool
      skyparkPalmPositions.push(new THREE.Vector3(-8.5, 200.6, z + 7 + (Math.random() - 0.5) * 3));
    }

    skyparkPalmPositions.forEach(pos => {
      const palm = palmModel.clone();
      palm.position.copy(pos);
      palm.rotation.y = Math.random() * Math.PI * 2;
      const s = 0.85 + Math.random() * 0.3;
      palm.scale.set(s, s, s);
      this.group.add(palm);
    });
  }

  /**
   * Palm avenue lining the waterfront promenade
   */
  private buildPromenadePalmWalk(): void {
    const palmModel = this.createPalmTreeModel(7.0);

    // Waterfront promenade palm avenue (x ~ -65, z from -220 to +180)
    for (let z = -200; z <= 180; z += 12) {
      const palm = palmModel.clone();
      palm.position.set(-68 + (Math.random() - 0.5) * 2, 3.5, z);
      palm.rotation.y = Math.random() * Math.PI * 2;
      const s = 0.9 + Math.random() * 0.35;
      palm.scale.set(s, s, s);
      this.group.add(palm);
    }
  }

  /**
   * Creates a detailed 3D palm tree with textured curved fronds
   */
  private createPalmTreeModel(height: number): THREE.Group {
    const tree = new THREE.Group();

    // 1. Curved Trunk
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.3, height * 0.35, 0),
      new THREE.Vector3(0.5, height * 0.7, 0.2),
      new THREE.Vector3(0.2, height, 0.4)
    ]);

    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 12, 0.28, 8, false);
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x5a4632,
      roughness: 0.85,
      metalness: 0.05
    });
    const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
    trunkMesh.castShadow = true;
    trunkMesh.receiveShadow = true;
    tree.add(trunkMesh);

    // 2. Crown of Fronds
    const frondCount = 12;
    const frondGeo = new THREE.PlaneGeometry(1.6, 3.8);
    frondGeo.translate(0, 1.9, 0);

    const frondMat = new THREE.MeshStandardMaterial({
      map: this.palmFrondTexture,
      transparent: true,
      alphaTest: 0.35,
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.05
    });

    const crownPos = new THREE.Vector3(0.2, height, 0.4);

    for (let i = 0; i < frondCount; i++) {
      const angle = (i / frondCount) * Math.PI * 2;
      const frond = new THREE.Mesh(frondGeo, frondMat);
      frond.position.copy(crownPos);
      frond.rotation.y = angle;
      frond.rotation.x = Math.PI / 2.8 + (Math.random() - 0.5) * 0.2;
      frond.rotation.z = (Math.random() - 0.5) * 0.2;
      frond.castShadow = true;
      tree.add(frond);
    }

    return tree;
  }
}
