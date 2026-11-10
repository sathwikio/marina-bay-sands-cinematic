import * as THREE from 'three';
import { SHOTS } from './Storyboard';
import { CameraKeyframe, ShotDefinition } from '../types';

export class CameraRig {
  public camera: THREE.PerspectiveCamera;
  private currentPosition: THREE.Vector3;
  private currentTarget: THREE.Vector3;
  private currentFov: number;

  // Zoom control (non-destructive)
  public targetZoomFactor: number = 1.0;
  public currentZoomFactor: number = 1.0;
  public readonly minZoom: number = 0.5;
  public readonly maxZoom: number = 2.5;

  constructor(aspect: number) {
    this.currentPosition = new THREE.Vector3(-420, 14, 150);
    this.currentTarget = new THREE.Vector3(-10, 85, 0);
    this.currentFov = 42;

    this.camera = new THREE.PerspectiveCamera(this.currentFov, aspect, 0.5, 4000);
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);
  }

  /**
   * Sets aspect ratio on window resize
   */
  public setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Adds user zoom delta (from mouse wheel or trackpad)
   */
  public addZoomDelta(delta: number): void {
    // Delta positive means zoom in, negative means zoom out
    this.targetZoomFactor = THREE.MathUtils.clamp(
      this.targetZoomFactor + delta,
      this.minZoom,
      this.maxZoom
    );
  }

  /**
   * Smoothly resets zoom back to default 1.0x
   */
  public resetZoom(): void {
    this.targetZoomFactor = 1.0;
  }

  /**
   * Updates camera position, lookAt target, and FOV for time t in [0, 60]
   */
  public update(time: number, dt: number): void {
    const clampedTime = THREE.MathUtils.clamp(time, 0.0, 59.999);

    // 1. Find active shot
    let activeShot: ShotDefinition = SHOTS[0];
    for (let i = 0; i < SHOTS.length; i++) {
      if (clampedTime >= SHOTS[i].startTime && clampedTime <= SHOTS[i].endTime) {
        activeShot = SHOTS[i];
        break;
      }
    }

    // 2. Interpolate within active shot keyframes
    const kfs = activeShot.keyframes;
    let kfA = kfs[0];
    let kfB = kfs[kfs.length - 1];

    for (let i = 0; i < kfs.length - 1; i++) {
      if (clampedTime >= kfs[i].time && clampedTime <= kfs[i + 1].time) {
        kfA = kfs[i];
        kfB = kfs[i + 1];
        break;
      }
    }

    const duration = kfB.time - kfA.time;
    let localT = duration > 0 ? (clampedTime - kfA.time) / duration : 0;

    // Smooth cubic Hermite ease-in-out: 3t^2 - 2t^3
    const smoothT = localT * localT * (3 - 2 * localT);

    // Interpolate position and lookAt target
    this.currentPosition.lerpVectors(kfA.position, kfB.position, smoothT);
    this.currentTarget.lerpVectors(kfA.target, kfB.target, smoothT);
    this.currentFov = THREE.MathUtils.lerp(kfA.fov, kfB.fov, smoothT);

    // 3. Smooth zoom factor damping
    this.currentZoomFactor = THREE.MathUtils.damp(
      this.currentZoomFactor,
      this.targetZoomFactor,
      8.0,
      dt
    );

    // Optical zoom adjusts camera FOV without corrupting trajectory
    const effectiveFov = THREE.MathUtils.clamp(
      this.currentFov / this.currentZoomFactor,
      12.0,
      85.0
    );

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentTarget);
    this.camera.fov = effectiveFov;
    this.camera.updateProjectionMatrix();
  }

  public getActiveShotIndex(time: number): number {
    for (let i = 0; i < SHOTS.length; i++) {
      if (time >= SHOTS[i].startTime && time < SHOTS[i].endTime) {
        return i;
      }
    }
    return SHOTS.length - 1;
  }
}
