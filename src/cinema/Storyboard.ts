import * as THREE from 'three';
import { ShotDefinition } from '../types';

export const SHOTS: ShotDefinition[] = [
  {
    id: 1,
    name: 'Waterfront Approach',
    subheading: 'Low-altitude Bay Glide & Reflections',
    startTime: 0.0,
    endTime: 12.0,
    description: 'A low-altitude glide across the Marina Bay reservoir at golden hour, capturing the monumental silhouette of all three towers and their shimmering reflections in the water.',
    focalLengthInfo: '35mm Cine Lens • 42° FOV',
    keyframes: [
      {
        time: 0.0,
        position: new THREE.Vector3(-460, 28, 160),
        target: new THREE.Vector3(0, 95, 0),
        fov: 42
      },
      {
        time: 6.0,
        position: new THREE.Vector3(-340, 36, 90),
        target: new THREE.Vector3(0, 108, 0),
        fov: 40
      },
      {
        time: 12.0,
        position: new THREE.Vector3(-220, 44, 25),
        target: new THREE.Vector3(0, 120, 0),
        fov: 38
      }
    ]
  },
  {
    id: 2,
    name: 'Tower Ascent',
    subheading: 'Vertical Crane Climb & Curtain Wall',
    startTime: 12.0,
    endTime: 24.0,
    description: 'A dramatic vertical crane climb ascending the face of Tower 2, revealing the intricate floor plates, glass curtain wall balconies, and Moshe Safdie\'s curved leaning geometry.',
    focalLengthInfo: '28mm Wide Lens • 46° FOV',
    keyframes: [
      {
        time: 12.0,
        position: new THREE.Vector3(-140, 35, 10),
        target: new THREE.Vector3(-15, 75, 0),
        fov: 44
      },
      {
        time: 18.0,
        position: new THREE.Vector3(-110, 115, 5),
        target: new THREE.Vector3(-5, 145, 0),
        fov: 46
      },
      {
        time: 24.0,
        position: new THREE.Vector3(-80, 192, 0),
        target: new THREE.Vector3(0, 203, 0),
        fov: 48
      }
    ]
  },
  {
    id: 3,
    name: 'SkyPark Flyover',
    subheading: 'Infinity Pool & 66.5m Cantilever Tip',
    startTime: 24.0,
    endTime: 36.0,
    description: 'A sweeping cinematic glide right above the Sands SkyPark, starting over the 150m infinity pool, passing tropical palm groves and timber decking, and sweeping out over the world-record 66.5m North cantilever.',
    focalLengthInfo: '32mm Prime • 44° FOV',
    keyframes: [
      {
        time: 24.0,
        position: new THREE.Vector3(-28, 208, 90),
        target: new THREE.Vector3(-12, 202, 20),
        fov: 45
      },
      {
        time: 30.0,
        position: new THREE.Vector3(-22, 209, 0),
        target: new THREE.Vector3(-10, 202, -80),
        fov: 43
      },
      {
        time: 36.0,
        position: new THREE.Vector3(-36, 218, -140),
        target: new THREE.Vector3(-5, 201, -192),
        fov: 40
      }
    ]
  },
  {
    id: 4,
    name: 'Architectural Orbit',
    subheading: '26° Leaning Curve & Structural Spine',
    startTime: 36.0,
    endTime: 48.0,
    description: 'A fluid 90-degree orbital arc around the northern tip and eastern facade, highlighting the structural engineering marvel: Moshe Safdie\'s 26° leaning tower legs and the Arup movement joints.',
    focalLengthInfo: '40mm Architectural Lens • 36° FOV',
    keyframes: [
      {
        time: 36.0,
        position: new THREE.Vector3(-160, 165, -250),
        target: new THREE.Vector3(0, 110, -30),
        fov: 38
      },
      {
        time: 42.0,
        position: new THREE.Vector3(210, 150, -180),
        target: new THREE.Vector3(0, 105, 0),
        fov: 36
      },
      {
        time: 48.0,
        position: new THREE.Vector3(280, 130, 40),
        target: new THREE.Vector3(0, 95, 0),
        fov: 35
      }
    ]
  },
  {
    id: 5,
    name: 'Panoramic Pullback',
    subheading: 'Grand Masterplan & Horizon Silhouette',
    startTime: 48.0,
    endTime: 60.0,
    description: 'A majestic high-angle cinematic pullback revealing the entire Marina Bay Sands complex, the bay reservoir, promenade, ArtScience Museum, and distant city skyline in a grand architectural composition.',
    focalLengthInfo: '24mm Wide Anamorphic • 34° FOV',
    keyframes: [
      {
        time: 48.0,
        position: new THREE.Vector3(240, 150, 80),
        target: new THREE.Vector3(0, 105, 0),
        fov: 36
      },
      {
        time: 54.0,
        position: new THREE.Vector3(-220, 210, -180),
        target: new THREE.Vector3(0, 110, 0),
        fov: 35
      },
      {
        time: 60.0,
        position: new THREE.Vector3(-480, 250, -260),
        target: new THREE.Vector3(0, 115, 0),
        fov: 34
      }
    ]
  }
];
