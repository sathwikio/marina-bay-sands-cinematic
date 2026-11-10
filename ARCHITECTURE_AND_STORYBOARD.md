# Marina Bay Sands: Architectural Reconstruction & Cinematography Plan

## 1. Architectural Reference Dimensions & Formulas

Moshe Safdie and Arup designed Marina Bay Sands around a distinct asymmetric card-deck geometry. Our procedural construction is parameterized to match these verified engineering dimensions:

| Architectural Element | Real-World Dimension | Simulation Model Scale (1 unit = 1 meter) | Architectural Formula / Geometric Description |
| :--- | :--- | :--- | :--- |
| **Total Height (SkyPark Top Deck)** | 200.0 m | 200.0 units | Sits 200m above sea level datum |
| **Tower Height (Hotel Roof)** | 191.0 m | 191.0 units | 55 to 57 structural hotel storeys |
| **Floor-to-Floor Height** | ~3.4 m | 3.4 units per floor | 55 repetitive hotel guest room levels |
| **SkyPark Total Length** | 340.0 m | 340.0 units | Spans North-to-South over all three towers |
| **SkyPark Maximum Width** | 38.0 - 40.0 m | 38.0 units | Aerodynamic boat hull shape with curved belly |
| **North Cantilever Length** | 66.5 m | 66.5 units | Overhangs Tower 1 to the north; tapered tip |
| **South Overhang Length** | ~12.0 m | 12.0 units | Extends slightly beyond Tower 3 to the south |
| **Infinity Pool Length** | 146.0 - 150.0 m | 148.0 units | Along west edge of SkyPark (Towers 2 & 3) |
| **Tower Footprint (East-West)** | ~75.0 m base $\to$ 36.0 m top | 75.0m base $\to$ 36.0m top | East leg leans 26° inward, west leg is vertical/subtle curve |
| **Atrium Meeting Point** | Level 23 (~80.0 m height) | $y = 80.0$ units | East and west legs join to form unified tower column |
| **Tower Spacing (Center-to-Center)**| ~105.0 m | 105.0 units | Tower 1 ($z = -105$), Tower 2 ($z = 0$), Tower 3 ($z = +105$) |
| **Tower Width (North-South)** | ~45.0 m | 45.0 units | Narrow structural sheer walls at north/south ends |
| **Marina Bay Water Extent** | ~1200 m $\times$ 1200 m | 1200 $\times$ 1200 units | Calm reflective water surface at $y = 0.0$ |
| **Promenade Elevation** | +3.5 m above bay | $y = 3.5$ units | 20m wide boardwalk along western waterfront edge |
| **ArtScience Museum** | 60m diameter lotus | 60m envelope at $z = -140, x = -90$ | 10 distinct petal structures opening to sky |

### Tower Procedural Profile Equations
For height $y \in [0, 191]$:
1. **West Leg Profile (Bay Side)**:
   - For $y \in [0, 80]$: $x_{\text{west}}(y) = -18.0 - 2.0 \cdot \sin(\frac{y}{80} \cdot \frac{\pi}{2})$ (near-vertical with slight convex posture).
   - For $y \in [80, 191]$: $x_{\text{west}}(y) = -20.0$.
2. **East Leg Profile (Garden Side - Moshe Safdie's Leaning Curve)**:
   - For $y \in [0, 80]$: $x_{\text{east}}(y) = 55.0 - 40.0 \cdot \left(\frac{y}{80}\right)^{0.85}$ (sweeping inward from $+55\text{m}$ to $+15\text{m}$ at 26° inclination).
   - For $y \in [80, 191]$: $x_{\text{east}}(y) = 15.0$ (rises parallel to west leg as a 35m-deep unified tower).
3. **Internal Grand Atrium**:
   - The triangular void between $x_{\text{west}}(y)$ and $x_{\text{east}}(y)$ for $y \in [0, 80]$ forms the famous 23-storey glass-roofed hotel atrium.
4. **Instanced Facade Louvers & Balconies**:
   - West face: 55 continuous balcony horizontal bands with glass railings and recessed floor-to-ceiling guest suites.
   - East face: Shading louvers conforming to the sweeping curve.

---

## 2. 60-Second Deterministic Cinematography Storyboard

The film is composed of five continuous, mathematically calculated architectural camera sequences. Each sequence features carefully tuned focal lengths (FOV), camera positions, look-at targets, and ease-in/ease-out acceleration curves:

```
Timeline: 0s ---------------- 12s ---------------- 24s ---------------- 36s ---------------- 48s ---------------- 60s
Shots:    [Waterfront Approach] [  Tower Ascent  ] [ SkyPark Flyover ] [Architectural Orbit] [Panoramic Pullback]
```

### Shot 1: Waterfront Approach ($0.0\text{s} - 12.0\text{s}$)
- **Concept**: A low-altitude glide across the Marina Bay reservoir at golden hour, capturing the monumental silhouette of all three towers and their shimmering reflections in the water.
- **Duration**: 12 seconds ($t \in [0, 12]$).
- **Camera Path**:
  - $t = 0\text{s}$: Position $(-420, 12, 160)$, Target $(-10, 85, 0)$, FOV $42^\circ$.
  - $t = 12\text{s}$: Position $(-220, 28, 40)$, Target $(-5, 110, 0)$, FOV $40^\circ$.
- **Motion Dynamics**: Gentle forward dolly skimming $12\text{m}$ above the water surface, slowly climbing to $28\text{m}$ as the waterfront promenade and ArtScience Museum come into view.
- **Lighting & Atmosphere**: Sun low on the horizon at $15^\circ$ elevation, warm golden highlights reflecting across the water surface, towers glowing with warm backlighting.

### Shot 2: Tower Ascent ($12.0\text{s} - 24.0\text{s}$)
- **Concept**: A dramatic vertical crane climb ascending the face of Tower 2, revealing the intricate floor plates, glass curtain wall balconies, and Moshe Safdie's curved leaning geometry.
- **Duration**: 12 seconds ($t \in [12, 24]$).
- **Camera Path**:
  - $t = 12\text{s}$: Position $(-130, 25, -20)$, Target $(-15, 60, 0)$, FOV $45^\circ$.
  - $t = 24\text{s}$: Position $(-90, 195, -15)$, Target $(0, 202, 0)$, FOV $48^\circ$.
- **Motion Dynamics**: Exponential ease-in vertical ascent ($y: 25\text{m} \to 195\text{m}$) rising up the facade, culminating just below the underside belly of the Sands SkyPark.
- **Visual Impact**: Showcases the sheer scale of the 55 storeys and the sudden reveal of the cantilevered SkyPark underside trusses.

### Shot 3: SkyPark Flyover ($24.0\text{s} - 36.0\text{s}$)
- **Concept**: A sweeping cinematic glide right above the Sands SkyPark, starting over the 150m infinity pool, passing tropical palm groves and timber decking, and sweeping out over the world-record 66.5m North cantilever.
- **Duration**: 12 seconds ($t \in [24, 36]$).
- **Camera Path**:
  - $t = 24\text{s}$: Position $(-35, 212, 110)$, Target $(5, 204, 30)$, FOV $46^\circ$.
  - $t = 30\text{s}$: Position $(-20, 210, 0)$, Target $(2, 204, -70)$, FOV $44^\circ$.
  - $t = 36\text{s}$: Position $(-40, 222, -155)$, Target $(0, 202, -110)$, FOV $42^\circ$.
- **Motion Dynamics**: Smooth Catmull-Rom spline gliding alongside the infinity pool edge, catching the vanishing edge where pool water meets the Singapore skyline, then banking outward around the tip of the cantilever.

### Shot 4: Architectural Orbit ($36.0\text{s} - 48.0\text{s}$)
- **Concept**: A fluid 90-degree orbital arc around the northern tip and eastern facade, highlighting the structural engineering marvel: Moshe Safdie's 26° leaning tower legs and the Arup movement joints.
- **Duration**: 12 seconds ($t \in [36, 48]$).
- **Camera Path**:
  - $t = 36\text{s}$: Position $(-60, 185, -180)$, Target $(0, 150, -50)$, FOV $40^\circ$.
  - $t = 42\text{s}$: Position $(120, 160, -140)$, Target $(5, 120, 0)$, FOV $38^\circ$.
  - $t = 48\text{s}$: Position $(200, 130, 20)$, Target $(0, 100, 0)$, FOV $36^\circ$.
- **Motion Dynamics**: Circular trigonometric orbit transitioning from the northwest cantilever around to the eastern garden facade, illuminating the grand sweeping curved legs against the sea.

### Shot 5: Panoramic Pullback ($48.0\text{s} - 60.0\text{s}$)
- **Concept**: A majestic high-angle cinematic pullback revealing the entire Marina Bay Sands complex, the bay reservoir, promenade, ArtScience Museum, and distant city skyline in a grand architectural composition.
- **Duration**: 12 seconds ($t \in [48, 60]$).
- **Camera Path**:
  - $t = 48\text{s}$: Position $(170, 140, 60)$, Target $(0, 110, 0)$, FOV $38^\circ$.
  - $t = 60\text{s}$: Position $(-380, 230, -220)$, Target $(0, 120, 0)$, FOV $35^\circ$.
- **Motion Dynamics**: Broad diagonal upward pullback to a high-altitude grand architectural hero view, ending in a stable, contemplative tableau.

---

## 3. Real-Time Graphics & Rendering Pipeline

1. **Renderer**:
   - `THREE.WebGLRenderer` with `antialias: true`, `powerPreference: "high-performance"`.
   - Color Management: `THREE.ColorManagement.enabled = true`, Output Color Space: `THREE.SRGBColorSpace`.
   - Tone Mapping: `THREE.ACESFilmicToneMapping` with exposure $1.05$.
   - Shadow Maps: `THREE.PCFSoftShadowMap`, resolution $2048 \times 2048$ with cascading bounds centered on the towers.
2. **Post-Processing (EffectComposer)**:
   - `RenderPass`: Base PBR scene pass.
   - `UnrealBloomPass`: Subtle architectural glow for warm sunset highlights and interior building lights (Threshold: $0.85$, Strength: $0.35$, Radius: $0.5$).
   - `OutputPass`: High-fidelity tone mapping and sRGB color correction.
3. **Dynamic Water Simulation**:
   - Gerstner wave equations + dual moving normal map samplers in custom GLSL shader / Three.js Water component.
   - Planar reflection or high-resolution spherical environment reflection.
   - Realistic Fresnel reflectance ($F_0 = 0.02$) with deep tropical turquoise absorption ($#002b36 \to #073642$).
4. **Instanced Geometry Optimization**:
   - Over 3,000 hotel room balcony modules and window panels batched into single `THREE.InstancedMesh` instances per tower.
   - 200+ SkyPark palm trees and foliage clusters instanced.
   - 100+ promenade street lamps and bollards instanced.
   - Guaranteed draw call budget: $< 80$ draw calls total for the entire scene, ensuring a solid 60 FPS on any modern GPU.
5. **Timeline & Interaction Engine**:
   - Master time variable $t \in [0.0, 60.0]$ advancing by $dt$ on each frame when unpaused.
   - Scrubbing bar allows instant random access to any second with smooth continuous spline evaluation.
   - Camera Zoom: User mouse-wheel / pinch gesture adjusts camera field of view or dolly offset independently, without altering timeline state or spline orientation.
   - Transport controls: Play/Pause, Replay (jump to $t = 0$), Jump to specific shots ($0\text{s}, 12\text{s}, 24\text{s}, 36\text{s}, 48\text{s}$), Fullscreen toggle, FPS counter, High-Resolution Screenshot export.
