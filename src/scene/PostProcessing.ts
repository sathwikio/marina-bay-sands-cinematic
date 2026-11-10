import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export class PostProcessing {
  public composer: EffectComposer;
  public bloomPass: UnrealBloomPass;
  public renderPass: RenderPass;
  public outputPass: OutputPass;

  public sceneCalls: number = 0;
  public sceneTriangles: number = 0;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number
  ) {
    this.composer = new EffectComposer(renderer);

    // 1. Render Scene Pass
    this.renderPass = new RenderPass(scene, camera);
    
    // Intercept to measure true scene draw calls & triangles before post passes
    const origRender = this.renderPass.render.bind(this.renderPass);
    this.renderPass.render = (r, writeBuffer, readBuffer, deltaTime, maskActive) => {
      origRender(r, writeBuffer, readBuffer, deltaTime, maskActive);
      this.sceneCalls = r.info.render.calls;
      this.sceneTriangles = r.info.render.triangles;
    };

    this.composer.addPass(this.renderPass);

    // 2. Filmic Architectural Bloom Pass
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.08,  // subtle architectural glint
      0.25,  // radius
      0.96   // threshold
    );
    this.composer.addPass(this.bloomPass);

    // 3. Color Management & Output Pass
    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);
  }

  public setSize(width: number, height: number): void {
    this.composer.setSize(width, height);
    this.bloomPass.resolution.set(width, height);
  }

  public render(): void {
    this.composer.render();
  }
}
