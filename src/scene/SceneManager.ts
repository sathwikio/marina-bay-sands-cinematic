import * as THREE from 'three';
import { CameraRig } from '../cinema/CameraRig';
import { Environment } from './Environment';
import { MarinaBayWater } from './Water';
import { BackgroundSkyline } from './BackgroundSkyline';
import { TowerBuilder } from '../architecture/TowerBuilder';
import { SkyParkBuilder } from '../architecture/SkyParkBuilder';
import { LandscapingBuilder } from '../architecture/LandscapingBuilder';
import { WaterfrontBuilder } from '../architecture/WaterfrontBuilder';
import { PostProcessing } from './PostProcessing';
import { createArchitecturalEnvironmentMap } from '../assets/envMap';
import { AppMetrics } from '../types';

export class SceneManager {
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public cameraRig: CameraRig;
  public environment: Environment;
  public water: MarinaBayWater;
  public skyline: BackgroundSkyline;
  public towers: TowerBuilder;
  public skypark: SkyParkBuilder;
  public landscaping: LandscapingBuilder;
  public waterfront: WaterfrontBuilder;
  public postProcessing: PostProcessing;

  private container: HTMLElement;
  private width: number;
  private height: number;

  private sceneDrawCalls: number = 0;
  private sceneTriangles: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;

    // 1. Scene Initialization
    this.scene = new THREE.Scene();

    // 2. Camera Rig
    this.cameraRig = new CameraRig(this.width / this.height);

    // 3. High-Performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);

    // 4. Generate Calibrated Tropical Sunset Environment Map
    const envMap = createArchitecturalEnvironmentMap(this.renderer);
    this.scene.environment = envMap;
    this.scene.background = envMap;

    // 5. Directional Sun, Fog, and Fill Lighting
    this.environment = new Environment(this.scene);

    // 6. Architectural Components
    this.water = new MarinaBayWater(this.scene, this.environment.sunPosition);
    this.skyline = new BackgroundSkyline(this.scene);
    this.towers = new TowerBuilder(this.scene);
    this.skypark = new SkyParkBuilder(this.scene);
    this.landscaping = new LandscapingBuilder(this.scene);
    this.waterfront = new WaterfrontBuilder(this.scene);

    // 7. Post-Processing Pipeline
    this.postProcessing = new PostProcessing(
      this.renderer,
      this.scene,
      this.cameraRig.camera,
      this.width,
      this.height
    );

    // Event Listeners
    window.addEventListener('resize', this.onResize.bind(this));
    this.setupContextHandling();
  }

  private onResize(): void {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;

    this.cameraRig.setAspect(this.width / this.height);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.postProcessing.setSize(this.width, this.height);
  }

  private setupContextHandling(): void {
    const canvas = this.renderer.domElement;
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      console.warn('WebGL context lost. Pausing rendering...');
    });

    canvas.addEventListener('webglcontextrestored', () => {
      console.info('WebGL context restored. Rebuilding rendering pipeline...');
      this.postProcessing = new PostProcessing(
        this.renderer,
        this.scene,
        this.cameraRig.camera,
        this.width,
        this.height
      );
    });
  }

  public update(time: number, dt: number): void {
    this.cameraRig.update(time, dt);
    this.water.update(dt);
    this.environment.update();
  }

  public render(): void {
    this.postProcessing.render();
    this.sceneDrawCalls = this.renderer.info.render.calls;
    this.sceneTriangles = this.renderer.info.render.triangles;
  }

  public captureScreenshot(): string {
    this.render();
    return this.renderer.domElement.toDataURL('image/png');
  }

  public getMetrics(fps: number, frameTimeMs: number): AppMetrics {
    const info = this.renderer.info;
    return {
      fps: Math.round(fps),
      frameTimeMs: Number(frameTimeMs.toFixed(1)),
      drawCalls: this.postProcessing.sceneCalls || info.render.calls,
      triangles: this.postProcessing.sceneTriangles || info.render.triangles,
      geometries: info.memory.geometries,
      textures: info.memory.textures
    };
  }
}
