import * as THREE from 'three';

export interface CameraKeyframe {
  time: number; // in seconds (0 - 60)
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

export interface ShotDefinition {
  id: number;
  name: string;
  subheading: string;
  startTime: number;
  endTime: number;
  description: string;
  focalLengthInfo: string;
  keyframes: CameraKeyframe[];
}

export interface AppMetrics {
  fps: number;
  frameTimeMs: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
}

export interface AppState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  zoomFactor: number; // 1.0 is default, >1 is zoomed in, <1 is zoomed out
  currentShotIndex: number;
  metrics: AppMetrics;
}
