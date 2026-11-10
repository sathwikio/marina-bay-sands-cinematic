import * as THREE from 'three';
import { createTeakDeckTexture } from '../assets/textures';

export class SkyParkBuilder {
  public group: THREE.Group;

  // Materials
  private hullCladdingMat: THREE.MeshStandardMaterial;
  private teakDeckMat: THREE.MeshStandardMaterial;
  private poolWaterMat: THREE.MeshStandardMaterial;
  private poolTileMat: THREE.MeshStandardMaterial;
  private railingGlassMat: THREE.MeshPhysicalMaterial;
  private metallicFrameMat: THREE.MeshStandardMaterial;
  private canopyMat: THREE.MeshStandardMaterial;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    const teakTexture = createTeakDeckTexture();

    // 1. Aerodynamic Hull Cladding (Silvery architectural composite)
    this.hullCladdingMat = new THREE.MeshStandardMaterial({
      color: 0xebedf0,
      roughness: 0.28,
      metalness: 0.45
    });

    // 2. Teak Wood Decking
    this.teakDeckMat = new THREE.MeshStandardMaterial({
      color: 0xa68058,
      roughness: 0.70,
      metalness: 0.05,
      map: teakTexture
    });

    // 3. Infinity Pool Water Material
    this.poolWaterMat = new THREE.MeshStandardMaterial({
      color: 0x0fe0d0,
      roughness: 0.05,
      metalness: 0.15,
      transparent: true,
      opacity: 0.88
    });

    // 4. Ceramic Mosaic Pool Tiles
    this.poolTileMat = new THREE.MeshStandardMaterial({
      color: 0x147391,
      roughness: 0.20,
      metalness: 0.10
    });

    // 5. Perimeter Safety Glass Railings
    this.railingGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x90c4e8,
      roughness: 0.05,
      metalness: 0.10,
      transmission: 0.94,
      ior: 1.52,
      transparent: true,
      opacity: 0.65
    });

    // 6. Metal Frame & Stanchions
    this.metallicFrameMat = new THREE.MeshStandardMaterial({
      color: 0x505860,
      roughness: 0.35,
      metalness: 0.85
    });

    // 7. Restaurant Canopy (CÉ LA VI)
    this.canopyMat = new THREE.MeshStandardMaterial({
      color: 0xc83232, // signature deep red/terracotta canopy
      roughness: 0.50,
      metalness: 0.10
    });

    this.buildSkyParkHull();
    this.buildTopDeck();
    this.buildNorthCantilever();
    this.buildInfinityPool();
    this.buildPavilionsAndCanopies();
    this.buildPerimeterRailings();

    scene.add(this.group);
  }

  /**
   * Builds the 340-meter aerodynamic boat-hull keel profile
   * The hull underbelly curves down to enclose structural transfer trusses
   */
  private buildSkyParkHull(): void {
    const totalLength = 340.0;
    const centerZ = -25.0; // Center offset so North Cantilever extends to z = -195, South to +145
    const deckY = 199.5;
    const hullDepth = 7.5; // depth from deck down to keel

    // Create curved aerodynamic cross-section hull using lofted curve / parametric extrude
    const hullShape = new THREE.Shape();
    // Start at west top edge
    hullShape.moveTo(-20, 0);
    // West vertical fascia
    hullShape.lineTo(-20, -1.5);
    // Smooth belly curve descending to center keel and rising to east edge
    hullShape.bezierCurveTo(-14, -hullDepth, 8, -hullDepth, 18, -1.5);
    hullShape.lineTo(18, 0);
    hullShape.closePath();

    // Extrude along Z axis with tapering at both bow and stern
    const extrudeSettings = {
      steps: 32,
      depth: totalLength,
      bevelEnabled: true,
      bevelThickness: 1.5,
      bevelSize: 1.2,
      bevelSegments: 4
    };

    const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
    // Center geometry so Z extends from -195 to +145
    hullGeo.translate(0, 0, -totalLength / 2);

    const hullMesh = new THREE.Mesh(hullGeo, this.hullCladdingMat);
    hullMesh.position.set(-1.0, deckY, centerZ);
    hullMesh.castShadow = true;
    hullMesh.receiveShadow = true;
    this.group.add(hullMesh);

    // Decorative structural ribbing bands along the hull underbelly
    const ribGeo = new THREE.BoxGeometry(38.5, 0.4, 0.8);
    const ribCount = 42;
    const ribInst = new THREE.InstancedMesh(ribGeo, this.metallicFrameMat, ribCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < ribCount; i++) {
      const z = -totalLength / 2 + (i / ribCount) * totalLength;
      dummy.position.set(-1.0, deckY - hullDepth + 0.3, centerZ + z);
      dummy.updateMatrix();
      ribInst.setMatrixAt(i, dummy.matrix);
    }
    ribInst.instanceMatrix.needsUpdate = true;
    this.group.add(ribInst);
  }

  /**
   * Builds the 340m teak promenade top deck
   */
  private buildTopDeck(): void {
    const deckLength = 338.0;
    const deckWidth = 37.0;
    const deckGeo = new THREE.BoxGeometry(deckWidth, 0.6, deckLength);
    const deckMesh = new THREE.Mesh(deckGeo, this.teakDeckMat);
    deckMesh.position.set(-1.0, 200.0, -25.0);
    deckMesh.receiveShadow = true;
    this.group.add(deckMesh);

    // Raised garden planter beds running down the central spine
    const planterMat = new THREE.MeshStandardMaterial({ color: 0x364030, roughness: 0.8 });
    const planterCount = 14;
    const planterGeo = new THREE.BoxGeometry(8.0, 0.8, 16.0);
    const planterMesh = new THREE.InstancedMesh(planterGeo, planterMat, planterCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < planterCount; i++) {
      const pz = -140 + i * 20;
      dummy.position.set(2.0, 200.6, pz);
      dummy.updateMatrix();
      planterMesh.setMatrixAt(i, dummy.matrix);
    }
    planterMesh.instanceMatrix.needsUpdate = true;
    planterMesh.receiveShadow = true;
    this.group.add(planterMesh);
  }

  /**
   * Builds the iconic 66.5m North Cantilever & Observation Deck
   * Extends out from Tower 1 (z = -105 - 22 = -127) to z = -193.5
   */
  private buildNorthCantilever(): void {
    const cantLength = 66.5;
    const tipZ = -194.0;
    const baseZ = tipZ + cantLength; // -127.5

    // Tapered prow shape of the cantilever tip
    const prowShape = new THREE.Shape();
    prowShape.moveTo(-18, 0);
    prowShape.lineTo(-12, -cantLength);
    prowShape.lineTo(10, -cantLength);
    prowShape.lineTo(17, 0);
    prowShape.closePath();

    const prowExtrude = {
      steps: 1,
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.2
    };

    const prowGeo = new THREE.ExtrudeGeometry(prowShape, prowExtrude);
    prowGeo.rotateX(Math.PI / 2);
    const prowMesh = new THREE.Mesh(prowGeo, this.teakDeckMat);
    prowMesh.position.set(-1.0, 200.2, baseZ);
    this.group.add(prowMesh);

    // Tiered amphitheater / observation deck viewing steps at the tip
    for (let step = 0; step < 4; step++) {
      const stepWidth = 18 - step * 2.5;
      const stepGeo = new THREE.BoxGeometry(stepWidth, 0.45, 3.5);
      const stepMesh = new THREE.Mesh(stepGeo, this.teakDeckMat);
      stepMesh.position.set(-1.0, 200.4 + step * 0.4, tipZ + 4.0 + step * 3.2);
      stepMesh.receiveShadow = true;
      this.group.add(stepMesh);
    }

    // Cantilever Tip Flagpole & Beacon
    const poleGeo = new THREE.CylinderGeometry(0.12, 0.25, 14, 8);
    const poleMesh = new THREE.Mesh(poleGeo, this.metallicFrameMat);
    poleMesh.position.set(-1.0, 207.0, tipZ + 1.5);
    this.group.add(poleMesh);

    const beaconGeo = new THREE.SphereGeometry(0.35, 8, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.position.set(-1.0, 214.0, tipZ + 1.5);
    this.group.add(beaconMesh);
  }

  /**
   * Builds the 148m rooftop Infinity Pool
   * Sits on the western edge overlooking Marina Bay (spanning Towers 2 and 3)
   */
  private buildInfinityPool(): void {
    const poolLength = 148.0;
    const poolWidth = 8.5;
    const poolDepth = 1.4;
    const poolX = -14.5; // positioned on the western edge
    const poolZ = 52.0;  // spans from z = -22 to z = +126

    // 1. Pool Basin / Trough
    const basinGeo = new THREE.BoxGeometry(poolWidth, poolDepth, poolLength);
    const basinMesh = new THREE.Mesh(basinGeo, this.poolTileMat);
    basinMesh.position.set(poolX, 200.0 - poolDepth / 2, poolZ);
    basinMesh.receiveShadow = true;
    this.group.add(basinMesh);

    // 2. Crystal Turquoise Pool Water Surface
    const waterGeo = new THREE.PlaneGeometry(poolWidth - 0.2, poolLength - 0.4);
    const waterMesh = new THREE.Mesh(waterGeo, this.poolWaterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.set(poolX, 199.9, poolZ);
    this.group.add(waterMesh);

    // 3. Vanishing Edge Weir & Catch Basin
    // The famous negative edge facing the bay
    const weirGeo = new THREE.BoxGeometry(0.3, 0.4, poolLength);
    const weirMesh = new THREE.Mesh(weirGeo, this.hullCladdingMat);
    weirMesh.position.set(poolX - poolWidth / 2 - 0.15, 199.8, poolZ);
    this.group.add(weirMesh);

    // Catchment trough underneath the weir
    const catchGeo = new THREE.BoxGeometry(1.2, 0.8, poolLength);
    const catchMesh = new THREE.Mesh(catchGeo, this.metallicFrameMat);
    catchMesh.position.set(poolX - poolWidth / 2 - 0.8, 199.2, poolZ);
    this.group.add(catchMesh);

    // 4. Pool Loungers and Sunbeds
    const loungerCount = 36;
    const loungerGeo = new THREE.BoxGeometry(1.8, 0.4, 0.9);
    const loungerMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const loungerInst = new THREE.InstancedMesh(loungerGeo, loungerMat, loungerCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < loungerCount; i++) {
      const z = poolZ - poolLength / 2 + 4.0 + (i / loungerCount) * (poolLength - 8.0);
      dummy.position.set(poolX + poolWidth / 2 + 1.8, 200.4, z);
      dummy.updateMatrix();
      loungerInst.setMatrixAt(i, dummy.matrix);
    }
    loungerInst.instanceMatrix.needsUpdate = true;
    loungerInst.castShadow = true;
    this.group.add(loungerInst);
  }

  /**
   * Builds CÉ LA VI restaurant pavilion and rooftop bar canopy
   */
  private buildPavilionsAndCanopies(): void {
    // 1. North Cantilever Restaurant Pavilion (CÉ LA VI)
    const restoGeo = new THREE.CylinderGeometry(8.0, 9.0, 4.2, 24);
    const restoMat = new THREE.MeshStandardMaterial({
      color: 0x1f242b,
      roughness: 0.25,
      metalness: 0.70
    });
    const restoMesh = new THREE.Mesh(restoGeo, restoMat);
    restoMesh.position.set(-1.0, 202.4, -145.0);
    restoMesh.castShadow = true;
    this.group.add(restoMesh);

    // Circular fabric shade umbrellas / canopies
    const canopyGeo = new THREE.ConeGeometry(5.0, 1.8, 16);
    const canopyMesh = new THREE.Mesh(canopyGeo, this.canopyMat);
    canopyMesh.position.set(-1.0, 205.2, -145.0);
    this.group.add(canopyMesh);

    // Additional shade sails
    for (let s = 0; s < 3; s++) {
      const sailGeo = new THREE.ConeGeometry(3.5, 1.2, 12);
      const sailMesh = new THREE.Mesh(sailGeo, this.canopyMat);
      sailMesh.position.set(6.0 - s * 6.0, 204.0, -162.0 + s * 8.0);
      sailMesh.castShadow = true;
      this.group.add(sailMesh);
    }

    // 2. South Pavilion & Club Lounge (Tower 3 apex)
    const loungeGeo = new THREE.BoxGeometry(14.0, 4.5, 22.0);
    const loungeMesh = new THREE.Mesh(loungeGeo, restoMat);
    loungeMesh.position.set(2.0, 202.5, 120.0);
    loungeMesh.castShadow = true;
    this.group.add(loungeMesh);

    // Glass curtain walls on the lounge
    const lGlassGeo = new THREE.BoxGeometry(14.2, 3.8, 20.0);
    const lGlassMesh = new THREE.Mesh(lGlassGeo, this.railingGlassMat);
    lGlassMesh.position.set(2.0, 202.5, 120.0);
    this.group.add(lGlassMesh);
  }

  /**
   * Instanced glass safety railings around the SkyPark perimeter
   */
  private buildPerimeterRailings(): void {
    const totalLength = 338.0;
    const railingCount = 120;
    const railingGeo = new THREE.BoxGeometry(0.1, 1.4, totalLength / railingCount);
    const railingMesh = new THREE.InstancedMesh(railingGeo, this.railingGlassMat, railingCount * 2);
    const dummy = new THREE.Object3D();

    let idx = 0;
    // East Edge Railing
    for (let i = 0; i < railingCount; i++) {
      const z = -25.0 - totalLength / 2 + (i + 0.5) * (totalLength / railingCount);
      dummy.position.set(17.4, 201.0, z);
      dummy.updateMatrix();
      railingMesh.setMatrixAt(idx++, dummy.matrix);
    }

    // West Edge Railing (outside the pool/deck)
    for (let i = 0; i < railingCount; i++) {
      const z = -25.0 - totalLength / 2 + (i + 0.5) * (totalLength / railingCount);
      dummy.position.set(-19.4, 201.0, z);
      dummy.updateMatrix();
      railingMesh.setMatrixAt(idx++, dummy.matrix);
    }

    railingMesh.instanceMatrix.needsUpdate = true;
    this.group.add(railingMesh);
  }
}
