# Marina Bay Sands Cinematic Architectural Reconstruction: Technical Implementation Plan

## 1. Project Overview & Tech Stack
- **Framework**: Vite + TypeScript (Modern ESNext, strict typechecking).
- **3D Engine**: Three.js (v0.187.0) with WebGLRenderer.
- **Post-Processing**: Three.js EffectComposer, RenderPass, UnrealBloomPass, OutputPass.
- **Environment & Atmospheric Physics**: Three.js Sky shader (Rayleigh / Mie solar scattering), Directional Sun with PCFSoftShadowMap, Ambient/Hemisphere fill, exponential height fog.
- **Materials**: Physically Based Materials (`MeshStandardMaterial`, `MeshPhysicalMaterial`) with transmission, roughness, metalness, and procedural normal/specular maps.
- **Architecture**: Modular TypeScript architecture with separate modules for Towers, SkyPark, Waterfront, Lighting, Cinematography, and User Interface.

---

## 2. Module Decomposition

```
src/
├── main.ts                    # Application bootstrap, lifecycle, and loop
├── types.ts                   # Types for CameraKeyframe, ShotDefinition, AppState
├── assets/
│   └── textures.ts            # Procedural CC0 water normal maps and PBR textures
├── scene/
│   ├── SceneManager.ts        # Scene graph, renderer, PMREM, resizing, shadows
│   ├── Environment.ts         # Sky Rayleigh/Mie scattering, sun, fog, ambient
│   ├── PostProcessing.ts      # EffectComposer, bloom thresholding, ACESFilmic
│   ├── Water.ts               # Marina Bay water shader with dual-octave waves
│   └── BackgroundSkyline.ts   # Distant Singapore CBD silhouette & reflections
├── architecture/
│   ├── TowerBuilder.ts        # Procedural Moshe Safdie curved hotel towers (1, 2, 3)
│   ├── SkyParkBuilder.ts      # 340m SkyPark deck, 66.5m cantilever, infinity pool
│   ├── WaterfrontBuilder.ts   # Bayfront promenade, ArtScience Museum, retail mall
│   └── LandscapingBuilder.ts  # Instanced tropical palm trees, planters, railings
├── cinema/
│   ├── CameraRig.ts           # Smooth CatmullRom spline interpolator, FOV, lookAt
│   ├── Storyboard.ts          # 5 deterministic shots (0-12s, 12-24s, 24-36s, 36-48s, 48-60s)
│   └── Timeline.ts            # Deterministic time engine, play/pause, replay, scrub
└── ui/
    ├── CinematicOverlay.ts    # Translucent film UI, scrub bar, shot badges, timecode
    ├── InteractionController.ts # Non-destructive mouse/trackpad zoom, keyboard shortcuts
    └── PerformanceMonitor.ts  # Real-time FPS, draw call, and memory metrics
```

---

## 3. Implementation Milestones

### Milestone 1: Environment & Mathematical Water Surface
- Set up Vite + TS application structure.
- Implement procedural seamless multi-octave water normal generator (CC0).
- Integrate dynamic Three.js Water / custom wave shader with Fresnel reflectance ($F_0 = 0.02$).
- Implement tropical Singapore golden-hour Sky simulation with real-time sun angle ($12^\circ$ elevation).

### Milestone 2: Moshe Safdie Hotel Towers (Towers 1, 2, 3)
- Mathematically generate the asymmetric profile:
  - Western leg: near vertical with subtle bowing ($x_{\text{west}}(y)$).
  - Eastern leg: 26° dramatic inward curve meeting at Level 23 ($y = 80\text{m}$).
  - Monolithic upper trunk extending from $y = 80\text{m}$ to $y = 191\text{m}$.
- High-efficiency `InstancedMesh` facade:
  - 55 horizontal balcony slabs per tower.
  - Recessed floor-to-ceiling glass guest room bays ($> 2,500$ rooms).
  - Vertical structural fins and sheer walls on north/south tower ends.
  - Grand 23-storey glass atrium canopy between the legs.

### Milestone 3: Sands SkyPark, 66.5m Cantilever & Infinity Pool
- Model the aerodynamic boat hull keel profile of the SkyPark underside (aluminum composite panels).
- Construct the 340m continuous upper deck spanning across Towers 1, 2, and 3.
- Build the 66.5m North Cantilever extending out over Tower 1 with tapered observation deck.
- Implement the 148m Infinity Pool on the western edge with crystal-clear water and glass weir edge overlooking the bay.
- Populate with instanced tropical palm trees, timber sun decks, dining canopies, and perimeter safety railings.

### Milestone 4: Waterfront Context & Skyline Setting
- Model the waterfront promenade boardwalk (+3.5m datum) with granite seawall and pedestrian paths.
- Construct the iconic ArtScience Museum (10-petal lotus blossom geometry) at the northern bay front.
- Add The Shoppes at Marina Bay Sands curved retail podium and Bayfront Avenue.
- Model Singapore Central Business District (CBD) financial towers across the bay to provide realistic horizon silhouettes and reflections.

### Milestone 5: 60-Second Cinematography & Deterministic Camera Rig
- Implement the 5 continuous camera shots using Catmull-Rom spline curves:
  - **0-12s**: Waterfront Approach (low glide across Marina Bay).
  - **12-24s**: Tower Ascent (vertical crane climb up Tower 2).
  - **24-36s**: SkyPark Flyover (glide along infinity pool and out over the cantilever).
  - **36-48s**: Architectural Orbit (sweeping arc revealing the 26° leaning tower curve).
  - **48-60s**: Panoramic Pullback (grand high-angle hero tableau).
- Seamless quaternion orientation and dynamic FOV transitions.
- Independent mouse-wheel/trackpad zoom that offsets distance without altering camera trajectory.

### Milestone 6: Cinematic Film UI, Interaction & Verification
- Minimal, unobtrusive dark-glass HUD:
  - Interactive scrubbable timeline slider with timecode readout (`00:00.0 / 01:00.0`).
  - Shot name pill indicators with click-to-jump.
  - Play / Pause / Replay transport buttons.
  - High-resolution screenshot capture button (`PNG`).
  - FPS and performance badge.
- Capture automated milestone screenshots and verify visual fidelity against architectural references.
- Document performance and build artifacts.
