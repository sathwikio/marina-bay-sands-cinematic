import * as THREE from 'three';
import { createGraniteTexture } from '../assets/textures';

export class WaterfrontBuilder {
  public group: THREE.Group;

  private graniteMat: THREE.MeshStandardMaterial;
  private seawallMat: THREE.MeshStandardMaterial;
  private retailMat: THREE.MeshStandardMaterial;
  private retailGlassMat: THREE.MeshPhysicalMaterial;
  private museumPetalMat: THREE.MeshStandardMaterial;
  private museumGlassMat: THREE.MeshPhysicalMaterial;
  private roadMat: THREE.MeshStandardMaterial;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    const graniteTex = createGraniteTexture();

    // PBR Materials
    this.graniteMat = new THREE.MeshStandardMaterial({
      color: 0x22262c,
      roughness: 0.60,
      metalness: 0.10,
      map: graniteTex
    });

    this.seawallMat = new THREE.MeshStandardMaterial({
      color: 0x30353c,
      roughness: 0.75,
      metalness: 0.05
    });

    this.retailMat = new THREE.MeshStandardMaterial({
      color: 0xdcdfd6,
      roughness: 0.45,
      metalness: 0.20
    });

    this.retailGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1f3c52,
      roughness: 0.06,
      metalness: 0.20,
      transmission: 0.90,
      ior: 1.52,
      transparent: true,
      opacity: 0.85
    });

    this.museumPetalMat = new THREE.MeshStandardMaterial({
      color: 0xf5f7fa, // gleaming white fiber-reinforced polymer
      roughness: 0.25,
      metalness: 0.15
    });

    this.museumGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x4a7a9e,
      roughness: 0.05,
      metalness: 0.30,
      transmission: 0.92,
      ior: 1.50,
      transparent: true,
      opacity: 0.85
    });

    this.roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e2024,
      roughness: 0.80,
      metalness: 0.05
    });

    this.buildPromenade();
    this.buildTheShoppesPodium();
    this.buildArtScienceMuseum();
    this.buildBayfrontAvenue();
    this.buildEastGardenLandscape();

    scene.add(this.group);
  }

  /**
   * Gardens by the Bay landscape setting on the East side of the towers
   */
  private buildEastGardenLandscape(): void {
    const gardenGeo = new THREE.PlaneGeometry(900, 900);
    const gardenMat = new THREE.MeshStandardMaterial({
      color: 0x1b2818, // lush tropical greenery
      roughness: 0.88,
      metalness: 0.05
    });

    const gardenMesh = new THREE.Mesh(gardenGeo, gardenMat);
    gardenMesh.rotation.x = -Math.PI / 2;
    gardenMesh.position.set(450, 0.4, 0);
    gardenMesh.receiveShadow = true;
    this.group.add(gardenMesh);

    // Landscaped garden walking paths and plazas
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0x5a564c,
      roughness: 0.75,
      metalness: 0.10
    });

    // Circular garden arrival plaza
    const plazaGeo = new THREE.CircleGeometry(45, 32);
    const plazaMesh = new THREE.Mesh(plazaGeo, pathMat);
    plazaMesh.rotation.x = -Math.PI / 2;
    plazaMesh.position.set(85, 0.5, 0);
    plazaMesh.receiveShadow = true;
    this.group.add(plazaMesh);

    // Winding path
    const pathGeo = new THREE.BoxGeometry(12, 0.2, 500);
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.position.set(120, 0.5, 0);
    pathMesh.receiveShadow = true;
    this.group.add(pathMesh);
  }

  /**
   * Waterfront promenade and stepped granite seawall
   */
  private buildPromenade(): void {
    const promLength = 460.0;
    const promWidth = 24.0;
    const promY = 3.5;
    const promX = -72.0;

    // 1. Promenade Paved Deck
    const promGeo = new THREE.BoxGeometry(promWidth, 1.0, promLength);
    const promMesh = new THREE.Mesh(promGeo, this.graniteMat);
    promMesh.position.set(promX, promY - 0.5, -10.0);
    promMesh.receiveShadow = true;
    this.group.add(promMesh);

    // 2. Seawall revetment meeting the water
    const wallGeo = new THREE.BoxGeometry(2.0, 4.0, promLength);
    const wallMesh = new THREE.Mesh(wallGeo, this.seawallMat);
    wallMesh.position.set(promX - promWidth / 2 - 1.0, 1.8, -10.0);
    wallMesh.receiveShadow = true;
    this.group.add(wallMesh);

    // 3. Waterfront Streetlamps (instanced)
    const lampCount = 28;
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 4.5, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x22262a, metalness: 0.85, roughness: 0.3 });
    const lampPoleInst = new THREE.InstancedMesh(poleGeo, poleMat, lampCount);

    const headGeo = new THREE.BoxGeometry(0.35, 0.25, 0.8);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xffe6b0 });
    const lampHeadInst = new THREE.InstancedMesh(headGeo, headMat, lampCount);

    const dummy = new THREE.Object3D();

    for (let i = 0; i < lampCount; i++) {
      const z = -220.0 + (i / lampCount) * 440.0;
      dummy.position.set(promX - promWidth / 2 + 1.5, promY + 2.25, z);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      lampPoleInst.setMatrixAt(i, dummy.matrix);

      dummy.position.set(promX - promWidth / 2 + 1.8, promY + 4.4, z);
      dummy.updateMatrix();
      lampHeadInst.setMatrixAt(i, dummy.matrix);
    }

    lampPoleInst.instanceMatrix.needsUpdate = true;
    lampHeadInst.instanceMatrix.needsUpdate = true;
    this.group.add(lampPoleInst);
    this.group.add(lampHeadInst);
  }

  /**
   * The Shoppes at Marina Bay Sands (Wave-form retail podium)
   */
  private buildTheShoppesPodium(): void {
    const podiumLength = 320.0;
    const podiumWidth = 32.0;
    const podiumHeight = 16.0;
    const podiumX = -44.0;

    // Stepped terraces
    for (let t = 0; t < 3; t++) {
      const w = podiumWidth - t * 4.0;
      const h = podiumHeight / 3;
      const y = t * h + h / 2 + 3.0;
      const x = podiumX + t * 2.0;

      const tGeo = new THREE.BoxGeometry(w, h, podiumLength - t * 20.0);
      const tMesh = new THREE.Mesh(tGeo, this.retailMat);
      tMesh.position.set(x, y, -10.0);
      tMesh.castShadow = true;
      tMesh.receiveShadow = true;
      this.group.add(tMesh);
    }

    // Glass atrium canopy over the canal inside the mall
    const skylightGeo = new THREE.CylinderGeometry(8.0, 8.0, podiumLength - 40.0, 16, 1, false, 0, Math.PI);
    const skylightMesh = new THREE.Mesh(skylightGeo, this.retailGlassMat);
    skylightMesh.rotation.z = Math.PI / 2;
    skylightMesh.rotation.y = Math.PI / 2;
    skylightMesh.position.set(podiumX, podiumHeight + 3.0, -10.0);
    this.group.add(skylightMesh);
  }

  /**
   * ArtScience Museum (Iconic 10-petal lotus blossom geometry)
   * Designed by Moshe Safdie as "The Welcoming Hand of Singapore"
   */
  private buildArtScienceMuseum(): void {
    const museum = new THREE.Group();
    const posX = -105.0;
    const posZ = -145.0;
    const baseY = 3.5;

    // 1. Water Lily Pond circular basin
    const basinGeo = new THREE.CylinderGeometry(38.0, 40.0, 1.2, 32);
    const basinMesh = new THREE.Mesh(basinGeo, this.seawallMat);
    basinMesh.position.set(posX, baseY + 0.6, posZ);
    basinMesh.receiveShadow = true;
    museum.add(basinMesh);

    // 2. Sculptural Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(16.0, 24.0, 12.0, 24);
    const baseMesh = new THREE.Mesh(baseGeo, this.museumPetalMat);
    baseMesh.position.set(posX, baseY + 6.0, posZ);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    museum.add(baseMesh);

    // 3. The 10 Lotus Petals ("Fingers")
    // Each petal curves outwards and upwards, tipped with skylights
    const petalCount = 10;
    const petalHeights = [18, 24, 32, 42, 48, 52, 44, 34, 26, 20]; // asymmetrical dynamic heights

    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const petalHeight = petalHeights[i];

      // Petal curved geometry using Extrude along path
      const petalShape = new THREE.Shape();
      petalShape.moveTo(-3.5, 0);
      petalShape.lineTo(3.5, 0);
      petalShape.lineTo(4.5, petalHeight);
      petalShape.lineTo(-4.5, petalHeight);
      petalShape.closePath();

      const extrudeSettings = {
        steps: 4,
        depth: 4.5,
        bevelEnabled: true,
        bevelThickness: 1.0,
        bevelSize: 0.8,
        bevelSegments: 3
      };

      const petalGeo = new THREE.ExtrudeGeometry(petalShape, extrudeSettings);
      petalGeo.translate(0, 0, -2.25);

      const petalMesh = new THREE.Mesh(petalGeo, this.museumPetalMat);

      // Radial position outward from center
      const radDist = 14.0;
      petalMesh.position.set(
        posX + Math.cos(angle) * radDist,
        baseY + 11.0,
        posZ + Math.sin(angle) * radDist
      );

      // Outward flare angle (25 to 35 degrees)
      petalMesh.rotation.y = -angle + Math.PI / 2;
      petalMesh.rotation.x = 0.42; // flare outwards

      petalMesh.castShadow = true;
      petalMesh.receiveShadow = true;
      museum.add(petalMesh);

      // Skylight cap at the tip of each petal
      const capGeo = new THREE.CircleGeometry(3.6, 12);
      const capMesh = new THREE.Mesh(capGeo, this.museumGlassMat);
      capMesh.position.set(
        posX + Math.cos(angle) * (radDist + petalHeight * 0.4),
        baseY + 11.0 + petalHeight,
        posZ + Math.sin(angle) * (radDist + petalHeight * 0.4)
      );
      capMesh.rotation.x = -Math.PI / 2;
      museum.add(capMesh);
    }

    this.group.add(museum);
  }

  /**
   * Bayfront Avenue and access roads behind the promenade
   */
  private buildBayfrontAvenue(): void {
    const roadLength = 500.0;
    const roadWidth = 18.0;
    const roadGeo = new THREE.BoxGeometry(roadWidth, 0.4, roadLength);
    const roadMesh = new THREE.Mesh(roadGeo, this.roadMat);
    roadMesh.position.set(-18.0, 3.2, -10.0);
    roadMesh.receiveShadow = true;
    this.group.add(roadMesh);

    // Yellow and white traffic median stripes
    const stripeCount = 40;
    const stripeGeo = new THREE.BoxGeometry(0.3, 0.05, 5.0);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffd24d });
    const stripeInst = new THREE.InstancedMesh(stripeGeo, stripeMat, stripeCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < stripeCount; i++) {
      const z = -200 + i * 10;
      dummy.position.set(-18.0, 3.45, z);
      dummy.updateMatrix();
      stripeInst.setMatrixAt(i, dummy.matrix);
    }
    stripeInst.instanceMatrix.needsUpdate = true;
    this.group.add(stripeInst);
  }
}
