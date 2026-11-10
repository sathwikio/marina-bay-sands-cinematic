import * as THREE from 'three';
import { SceneManager } from './scene/SceneManager';
import { Timeline } from './cinema/Timeline';
import { CinematicOverlay } from './ui/CinematicOverlay';
import { InteractionController } from './ui/InteractionController';

class App {
  private sceneManager!: SceneManager;
  private timeline!: Timeline;
  private overlay!: CinematicOverlay;
  private interactionController!: InteractionController;

  private clock: THREE.Clock;
  private lastTime: number = performance.now();
  private frameCount: number = 0;
  private fps: number = 60;
  private frameTimeMs: number = 16.6;

  constructor() {
    this.clock = new THREE.Clock();
    this.init();
  }

  private async init(): Promise<void> {
    const canvasContainer = document.getElementById('canvas-container')!;
    const uiOverlay = document.getElementById('ui-overlay')!;
    const loader = document.getElementById('loader')!;
    const loaderProgress = document.getElementById('loader-progress')!;

    // Animate loading bar
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 15;
      if (loaderProgress) {
        loaderProgress.style.width = `${Math.min(100, progress)}%`;
      }
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 40);

    // Initialize core subsystems
    this.timeline = new Timeline();
    this.sceneManager = new SceneManager(canvasContainer);

    this.overlay = new CinematicOverlay(
      uiOverlay,
      this.timeline,
      this.sceneManager.cameraRig,
      this.captureAndDownloadScreenshot.bind(this)
    );

    this.interactionController = new InteractionController(
      canvasContainer,
      this.sceneManager.cameraRig,
      this.timeline,
      this.captureAndDownloadScreenshot.bind(this)
    );

    // Initial update to sync camera to t = 0
    this.sceneManager.update(this.timeline.currentTime, 0.016);

    // Expose for testing and automated telemetry
    (window as any).__MBS_APP__ = {
      timeline: this.timeline,
      sceneManager: this.sceneManager,
      cameraRig: this.sceneManager.cameraRig,
      overlay: this.overlay,
      getMetrics: () => this.sceneManager.getMetrics(this.fps, this.frameTimeMs)
    };

    // Hide loading screen smoothly
    setTimeout(() => {
      if (loader) {
        loader.classList.add('hidden');
      }
    }, 500);

    // Start main render loop
    this.animate();
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const now = performance.now();
    const dt = Math.min(this.clock.getDelta(), 0.1); // clamp delta to prevent giant leaps
    const elapsed = now - this.lastTime;
    this.lastTime = now;

    // Rolling FPS metric
    this.frameCount++;
    if (this.frameCount % 20 === 0) {
      this.fps = 1000 / Math.max(1, elapsed);
      this.frameTimeMs = elapsed;
      const metrics = this.sceneManager.getMetrics(this.fps, this.frameTimeMs);
      this.overlay.updateMetrics(metrics);
      this.overlay.updateZoomDisplay();
    }

    // 1. Advance timeline
    this.timeline.tick(dt);

    // 2. Update scene and camera rig
    this.sceneManager.update(this.timeline.currentTime, dt);

    // 3. Render frame
    this.sceneManager.render();
  };

  /**
   * Captures high-resolution PNG screenshot and triggers download
   */
  private captureAndDownloadScreenshot(): void {
    const dataUrl = this.sceneManager.captureScreenshot();
    const activeShotIdx = this.timeline.getShotIndex() + 1;
    const timeFormatted = this.timeline.currentTime.toFixed(1).replace('.', 's');

    const link = document.createElement('a');
    link.download = `MBS_Shot0${activeShotIdx}_${timeFormatted}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Bootstrap application on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
