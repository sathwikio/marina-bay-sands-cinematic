import * as THREE from 'three';
import { createWindowTexture } from '../assets/textures';

export class TowerBuilder {
  public group: THREE.Group;
  private windowTexture: THREE.Texture;

  // Architectural materials
  private concreteMat: THREE.MeshStandardMaterial;
  private balconyFloorMat: THREE.MeshStandardMaterial;
  private shearWallMat: THREE.MeshStandardMaterial;
  private glassMat: THREE.MeshStandardMaterial;
  private railingGlassMat: THREE.MeshStandardMaterial;
  private atriumGlassMat: THREE.MeshStandardMaterial;
  private metalTrimMat: THREE.MeshStandardMaterial;

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.windowTexture = createWindowTexture();

    // High performance PBR Materials with realistic architectural albedo
    this.concreteMat = new THREE.MeshStandardMaterial({
      color: 0xc8cbd0,
      roughness: 0.65,
      metalness: 0.08
    });

    this.balconyFloorMat = new THREE.MeshStandardMaterial({
      color: 0xd8dbe0,
      roughness: 0.50,
      metalness: 0.12
    });

    this.shearWallMat = new THREE.MeshStandardMaterial({
      color: 0xb5bac2,
      roughness: 0.60,
      metalness: 0.15
    });

    this.metalTrimMat = new THREE.MeshStandardMaterial({
      color: 0x2d343c,
      roughness: 0.35,
      metalness: 0.80
    });

    // Dark tinted solar control facade glass
    this.glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f2030,
      roughness: 0.10,
      metalness: 0.85
    });

    // Balcony transparent glass railing (clean transparency, zero milky artifacts)
    this.railingGlassMat = new THREE.MeshStandardMaterial({
      color: 0x3a6080,
      roughness: 0.10,
      metalness: 0.30,
      transparent: true,
      opacity: 0.40
    });

    this.atriumGlassMat = new THREE.MeshStandardMaterial({
      color: 0x1a3854,
      roughness: 0.12,
      metalness: 0.75,
      transparent: true,
      opacity: 0.70
    });

    // Towers 1, 2, 3 positioned along Z:
    // Tower 1 (North): z = -105
    // Tower 2 (Center): z = 0
    // Tower 3 (South): z = +105
    const towerZPositions = [-105, 0, 105];

    towerZPositions.forEach((tz, index) => {
      const towerGroup = this.buildSingleTower(index + 1, tz);
      this.group.add(towerGroup);
    });

    scene.add(this.group);
  }

  /**
   * Builds one of Moshe Safdie's three hotel towers
   */
  private buildSingleTower(towerNumber: number, centerZ: number): THREE.Group {
    const tower = new THREE.Group();
    tower.name = `Tower_${towerNumber}`;

    const numFloors = 55;
    const floorHeight = 191.0 / numFloors; // ~3.47m
    const towerWidth = 44.0;
    const atriumFloor = 23;
    const atriumHeight = atriumFloor * floorHeight; // ~80m

    const westLegExtrudeSettings = {
      steps: 1,
      depth: towerWidth,
      bevelEnabled: true,
      bevelThickness: 0.3,
      bevelSize: 0.3,
      bevelSegments: 2
    };

    // 1. Lower West Leg (Bay side, floors 0 to 23)
    const westLegShape = new THREE.Shape();
    westLegShape.moveTo(-20, 0);
    westLegShape.lineTo(-5, 0);
    westLegShape.lineTo(-5, atriumHeight);
    westLegShape.lineTo(-19, atriumHeight);
    westLegShape.closePath();

    const westLegGeo = new THREE.ExtrudeGeometry(westLegShape, westLegExtrudeSettings);
    westLegGeo.translate(0, 0, -towerWidth / 2);
    const westLegMesh = new THREE.Mesh(westLegGeo, this.concreteMat);
    westLegMesh.position.set(0, 0, centerZ);
    westLegMesh.castShadow = true;
    westLegMesh.receiveShadow = true;
    tower.add(westLegMesh);

    // 2. Lower East Leg (Garden side, floors 0 to 23)
    // Leans at 26 degrees inclination, sweeping from x = +55m to +15m
    const eastLegCurve = new THREE.Shape();
    eastLegCurve.moveTo(55, 0);
    eastLegCurve.lineTo(38, 0);
    eastLegCurve.quadraticCurveTo(24, atriumHeight * 0.5, 5, atriumHeight);
    eastLegCurve.lineTo(15, atriumHeight);
    eastLegCurve.quadraticCurveTo(38, atriumHeight * 0.5, 55, 0);
    eastLegCurve.closePath();

    const eastLegGeo = new THREE.ExtrudeGeometry(eastLegCurve, westLegExtrudeSettings);
    eastLegGeo.translate(0, 0, -towerWidth / 2);
    const eastLegMesh = new THREE.Mesh(eastLegGeo, this.concreteMat);
    eastLegMesh.position.set(0, 0, centerZ);
    eastLegMesh.castShadow = true;
    eastLegMesh.receiveShadow = true;
    tower.add(eastLegMesh);

    // 3. Grand 23-storey Atrium Glass Facade
    const atriumWidth = towerWidth - 2.0;
    const atriumGeom = new THREE.BufferGeometry();
    const atriumVertices = new Float32Array([
      -5, atriumHeight, -atriumWidth / 2,
       5, atriumHeight, -atriumWidth / 2,
      38, 0,            -atriumWidth / 2,

      -5, atriumHeight, -atriumWidth / 2,
      38, 0,            -atriumWidth / 2,
      -5, 0,            -atriumWidth / 2,

      -5, atriumHeight, atriumWidth / 2,
      38, 0,            atriumWidth / 2,
       5, atriumHeight, atriumWidth / 2,

      -5, atriumHeight, atriumWidth / 2,
      -5, 0,            atriumWidth / 2,
      38, 0,            atriumWidth / 2
    ]);
    atriumGeom.setAttribute('position', new THREE.BufferAttribute(atriumVertices, 3));
    atriumGeom.computeVertexNormals();
    const atriumMesh = new THREE.Mesh(atriumGeom, this.atriumGlassMat);
    atriumMesh.position.set(0, 0, centerZ);
    tower.add(atriumMesh);

    // 4. Upper Unified Tower Body (Floors 23 to 55)
    const upperHeight = 191.0 - atriumHeight;
    const upperGeo = new THREE.BoxGeometry(34.0, upperHeight, towerWidth);
    const upperMesh = new THREE.Mesh(upperGeo, this.concreteMat);
    upperMesh.position.set(-2.0, atriumHeight + upperHeight / 2, centerZ);
    upperMesh.castShadow = true;
    upperMesh.receiveShadow = true;
    tower.add(upperMesh);

    // 5. Facade Glass Curtain Wall & Horizontal Floor Balconies
    const dummy = new THREE.Object3D();

    // Balcony Slabs on West Face
    const balconyGeo = new THREE.BoxGeometry(2.2, 0.35, towerWidth - 1.2);
    const balconyMesh = new THREE.InstancedMesh(balconyGeo, this.balconyFloorMat, numFloors);
    balconyMesh.castShadow = true;
    balconyMesh.receiveShadow = true;

    for (let f = 0; f < numFloors; f++) {
      const yPos = (f + 0.5) * floorHeight;
      dummy.position.set(-20.1, yPos, centerZ);
      dummy.updateMatrix();
      balconyMesh.setMatrixAt(f, dummy.matrix);
    }
    balconyMesh.instanceMatrix.needsUpdate = true;
    tower.add(balconyMesh);

    // Balcony Glass Railings on West Face
    const glassRailingGeo = new THREE.BoxGeometry(0.1, 0.9, towerWidth - 1.4);
    const glassRailingMesh = new THREE.InstancedMesh(glassRailingGeo, this.railingGlassMat, numFloors);

    for (let f = 0; f < numFloors; f++) {
      const yPos = (f + 0.5) * floorHeight + 0.55;
      dummy.position.set(-21.1, yPos, centerZ);
      dummy.updateMatrix();
      glassRailingMesh.setMatrixAt(f, dummy.matrix);
    }
    glassRailingMesh.instanceMatrix.needsUpdate = true;
    tower.add(glassRailingMesh);

    // Facade Glazing panels with lit rooms (West Face Curtain Wall)
    const westGlazeGeo = new THREE.PlaneGeometry(towerWidth - 2.0, 191);
    const westGlazeMat = new THREE.MeshStandardMaterial({
      color: 0x182c3f,
      roughness: 0.18,
      metalness: 0.85,
      map: this.windowTexture
    });
    const westGlazeMesh = new THREE.Mesh(westGlazeGeo, westGlazeMat);
    westGlazeMesh.rotation.y = -Math.PI / 2;
    westGlazeMesh.position.set(-19.3, 191 / 2, centerZ);
    tower.add(westGlazeMesh);

    // East Face Curtain Wall (Upper Floors)
    const eastGlazeGeo = new THREE.PlaneGeometry(towerWidth - 2.0, upperHeight);
    const eastGlazeMesh = new THREE.Mesh(eastGlazeGeo, westGlazeMat);
    eastGlazeMesh.rotation.y = Math.PI / 2;
    eastGlazeMesh.position.set(15.1, atriumHeight + upperHeight / 2, centerZ);
    tower.add(eastGlazeMesh);

    // 6. Structural Sheer Walls on North and South ends
    const shearWallThick = 1.2;
    const northShearGeo = new THREE.BoxGeometry(35.0, upperHeight, shearWallThick);
    const northShearMesh = new THREE.Mesh(northShearGeo, this.shearWallMat);
    northShearMesh.position.set(-2.0, atriumHeight + upperHeight / 2, centerZ - towerWidth / 2);
    northShearMesh.castShadow = true;
    tower.add(northShearMesh);

    const southShearGeo = new THREE.BoxGeometry(35.0, upperHeight, shearWallThick);
    const southShearMesh = new THREE.Mesh(southShearGeo, this.shearWallMat);
    southShearMesh.position.set(-2.0, atriumHeight + upperHeight / 2, centerZ + towerWidth / 2);
    southShearMesh.castShadow = true;
    tower.add(southShearMesh);

    // 7. Roof Structural Bearings (support pedestals for the SkyPark truss)
    const bearingGeo = new THREE.BoxGeometry(8, 4.5, towerWidth * 0.8);
    const bearingMesh = new THREE.Mesh(bearingGeo, this.metalTrimMat);
    bearingMesh.position.set(-2, 193.0, centerZ);
    bearingMesh.castShadow = true;
    tower.add(bearingMesh);

    return tower;
  }
}
