import * as THREE from 'three';

export class Environment {
  public sunLight: THREE.DirectionalLight;
  public hemiLight: THREE.HemisphereLight;
  public ambientLight: THREE.AmbientLight;
  public sunPosition: THREE.Vector3;

  constructor(scene: THREE.Scene) {
    // Sun position: Golden hour sunset in Singapore (Elevation ~14°, Azimuth ~225° West-Southwest)
    const elevation = 14;
    const azimuth = 225;
    const phi = THREE.MathUtils.degToRad(90 - elevation);
    const theta = THREE.MathUtils.degToRad(azimuth);

    this.sunPosition = new THREE.Vector3();
    this.sunPosition.setFromSphericalCoords(1000, phi, theta);

    // 1. Primary Directional Sun Light
    this.sunLight = new THREE.DirectionalLight(0xffecd4, 2.2);
    this.sunLight.position.copy(this.sunPosition);
    this.sunLight.castShadow = true;

    // Shadow configuration
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 50;
    this.sunLight.shadow.camera.far = 2800;

    const shadowExtent = 260;
    this.sunLight.shadow.camera.left = -shadowExtent;
    this.sunLight.shadow.camera.right = shadowExtent;
    this.sunLight.shadow.camera.top = shadowExtent;
    this.sunLight.shadow.camera.bottom = -shadowExtent;
    this.sunLight.shadow.bias = -0.0002;
    this.sunLight.shadow.normalBias = 0.04;
    scene.add(this.sunLight);

    // 2. Soft Ambient & Sky Bounce Fill
    this.hemiLight = new THREE.HemisphereLight(0x507ea8, 0x181e24, 0.60);
    scene.add(this.hemiLight);

    this.ambientLight = new THREE.AmbientLight(0x121c26, 0.25);
    scene.add(this.ambientLight);

    // 3. Crisp Architectural Linear Fog (objects within 500m are crystal clear)
    scene.fog = new THREE.Fog(0x1a2e42, 600, 3200);
  }

  public update(): void {
    // Dynamic updates if needed
  }
}
