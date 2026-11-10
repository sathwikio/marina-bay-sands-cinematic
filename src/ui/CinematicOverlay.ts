import { Timeline } from '../cinema/Timeline';
import { CameraRig } from '../cinema/CameraRig';
import { SHOTS } from '../cinema/Storyboard';
import { AppMetrics } from '../types';

export class CinematicOverlay {
  private container: HTMLElement;
  private timeline: Timeline;
  private cameraRig: CameraRig;
  private onScreenshotRequest: () => void;

  // DOM elements
  private playPauseBtn!: HTMLButtonElement;
  private replayBtn!: HTMLButtonElement;
  private scrubTrack!: HTMLDivElement;
  private scrubProgress!: HTMLDivElement;
  private timecodeDisplay!: HTMLSpanElement;
  private shotTitleDisplay!: HTMLSpanElement;
  private shotSubtitleDisplay!: HTMLSpanElement;
  private zoomDisplay!: HTMLSpanElement;
  private resetZoomBtn!: HTMLButtonElement;
  private metricsDisplay!: HTMLDivElement;
  private shotButtons: HTMLButtonElement[] = [];

  private isDraggingScrub: boolean = false;

  constructor(
    container: HTMLElement,
    timeline: Timeline,
    cameraRig: CameraRig,
    onScreenshotRequest: () => void
  ) {
    this.container = container;
    this.timeline = timeline;
    this.cameraRig = cameraRig;
    this.onScreenshotRequest = onScreenshotRequest;

    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    this.container.innerHTML = `
      <style>
        .hud-glass {
          background: rgba(10, 15, 22, 0.72);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
        }

        .hud-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          width: 100%;
        }

        .hud-title-block {
          display: flex;
          flex-direction: column;
        }

        .hud-title {
          font-family: 'Cinzel', serif;
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #f0f6fc;
          text-transform: uppercase;
        }

        .hud-sub {
          font-size: 0.75rem;
          color: #8b949e;
          letter-spacing: 0.1em;
          margin-top: 2px;
        }

        .shot-nav {
          display: flex;
          gap: 6px;
        }

        .shot-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #c9d1d9;
          font-size: 0.72rem;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .shot-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .shot-btn.active {
          background: rgba(230, 184, 92, 0.22);
          color: #ffd685;
          border-color: rgba(230, 184, 92, 0.6);
        }

        .shot-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.65rem;
          opacity: 0.75;
        }

        .hud-top-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hud-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          color: #8b949e;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .btn-action {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f0f6fc;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-action:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.35);
        }

        /* Bottom Controls Bar */
        .hud-bottom {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          padding: 16px 22px;
        }

        .hud-info-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .shot-label-container {
          display: flex;
          flex-direction: column;
        }

        .active-shot-title {
          font-family: 'Cinzel', serif;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #ffd685;
        }

        .active-shot-sub {
          font-size: 0.78rem;
          color: #8b949e;
          margin-top: 2px;
        }

        .timecode-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.88rem;
          font-weight: 500;
          color: #f0f6fc;
          letter-spacing: 0.05em;
        }

        .scrub-wrapper {
          position: relative;
          width: 100%;
          height: 18px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .scrub-track {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
          position: relative;
          overflow: visible;
        }

        .scrub-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #d49a37, #f3cf7a);
          border-radius: 2px;
          position: absolute;
          left: 0;
          top: 0;
        }

        .scrub-thumb {
          position: absolute;
          top: 50%;
          right: -6px;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(243, 207, 122, 0.8);
        }

        /* Shot boundary markers */
        .shot-marker {
          position: absolute;
          top: -3px;
          width: 2px;
          height: 10px;
          background: rgba(255, 255, 255, 0.35);
          pointer-events: none;
        }

        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .transport-btns {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .transport-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .transport-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.35);
        }

        .telemetry-row {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          color: #7d8590;
          display: flex;
          gap: 16px;
        }

        .telemetry-val {
          color: #c9d1d9;
        }
      </style>

      <!-- Top HUD Header -->
      <div class="hud-top hud-glass interactive">
        <div class="hud-title-block">
          <div class="hud-title">Marina Bay Sands</div>
          <div class="hud-sub">Singapore • Moshe Safdie Architects • Arup Engineering</div>
        </div>

        <div class="shot-nav">
          ${SHOTS.map(shot => `
            <button class="shot-btn" data-shot="${shot.id - 1}" title="${shot.name}">
              <span class="shot-num">0${shot.id}</span>
              <span>${shot.name}</span>
            </button>
          `).join('')}
        </div>

        <div class="hud-top-right">
          <div class="hud-pill">
            <span id="zoom-indicator">1.0x ZOOM</span>
            <button id="btn-reset-zoom" class="btn-action" style="padding: 2px 8px; font-size: 0.68rem; display: none;">RESET</button>
          </div>
          <button id="btn-capture" class="btn-action" title="Capture high-resolution PNG screenshot">
            <span>📷 CAPTURE</span>
          </button>
        </div>
      </div>

      <!-- Bottom Film Controls HUD -->
      <div class="hud-bottom hud-glass interactive">
        <div class="hud-info-row">
          <div class="shot-label-container">
            <div id="active-shot-title" class="active-shot-title">01 • WATERFRONT APPROACH</div>
            <div id="active-shot-sub" class="active-shot-sub">Low-altitude Bay Glide & Reflections • 35mm Cine Lens</div>
          </div>
          <div class="timecode-label">
            <span id="timecode-current">00:00.0</span> / <span>01:00.0</span>
          </div>
        </div>

        <!-- Timeline Scrubber -->
        <div id="scrub-wrapper" class="scrub-wrapper">
          <div id="scrub-track" class="scrub-track">
            <div id="scrub-fill" class="scrub-fill">
              <div class="scrub-thumb"></div>
            </div>
            <!-- Shot divider ticks (12s, 24s, 36s, 48s) -->
            <div class="shot-marker" style="left: 20%;"></div>
            <div class="shot-marker" style="left: 40%;"></div>
            <div class="shot-marker" style="left: 60%;"></div>
            <div class="shot-marker" style="left: 80%;"></div>
          </div>
        </div>

        <div class="controls-row">
          <div class="transport-btns">
            <button id="btn-play-pause" class="transport-btn" title="Play/Pause (Space)">⏸</button>
            <button id="btn-replay" class="transport-btn" title="Replay Sequence (R)">↺</button>
          </div>

          <div id="telemetry-bar" class="telemetry-row">
            <div>FPS: <span id="tel-fps" class="telemetry-val">60</span></div>
            <div>FRAME: <span id="tel-ms" class="telemetry-val">16.6ms</span></div>
            <div>DRAWS: <span id="tel-calls" class="telemetry-val">42</span></div>
            <div>TRIANGLES: <span id="tel-tris" class="telemetry-val">120k</span></div>
          </div>
        </div>
      </div>
    `;

    // Query elements
    this.playPauseBtn = this.container.querySelector('#btn-play-pause')!;
    this.replayBtn = this.container.querySelector('#btn-replay')!;
    this.scrubTrack = this.container.querySelector('#scrub-track')!;
    this.scrubProgress = this.container.querySelector('#scrub-fill')!;
    this.timecodeDisplay = this.container.querySelector('#timecode-current')!;
    this.shotTitleDisplay = this.container.querySelector('#active-shot-title')!;
    this.shotSubtitleDisplay = this.container.querySelector('#active-shot-sub')!;
    this.zoomDisplay = this.container.querySelector('#zoom-indicator')!;
    this.resetZoomBtn = this.container.querySelector('#btn-reset-zoom')!;
    this.metricsDisplay = this.container.querySelector('#telemetry-bar')!;

    this.shotButtons = Array.from(this.container.querySelectorAll('.shot-btn'));
  }

  private attachEventListeners(): void {
    // Play / Pause
    this.playPauseBtn.addEventListener('click', () => {
      this.timeline.toggle();
    });

    // Replay
    this.replayBtn.addEventListener('click', () => {
      this.timeline.replay();
    });

    // Reset Zoom
    this.resetZoomBtn.addEventListener('click', () => {
      this.cameraRig.resetZoom();
      this.updateZoomDisplay();
    });

    // Capture screenshot
    const captureBtn = this.container.querySelector('#btn-capture')!;
    captureBtn.addEventListener('click', () => {
      this.onScreenshotRequest();
    });

    // Shot navigation buttons
    this.shotButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        this.timeline.jumpToShot(idx);
      });
    });

    // Scrubber interaction
    const scrubWrapper = this.container.querySelector('#scrub-wrapper')!;
    
    const handleScrub = (e: MouseEvent) => {
      const rect = this.scrubTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const frac = Math.max(0, Math.min(1, clickX / rect.width));
      this.timeline.seek(frac * this.timeline.duration);
    };

    scrubWrapper.addEventListener('mousedown', (e) => {
      this.isDraggingScrub = true;
      handleScrub(e as MouseEvent);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDraggingScrub) {
        handleScrub(e);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDraggingScrub = false;
    });

    // Subscribe to timeline ticks
    this.timeline.subscribe((time, isPlaying, shotIdx) => {
      this.updateTimelineUI(time, isPlaying, shotIdx);
    });
  }

  public updateTimelineUI(time: number, isPlaying: boolean, shotIdx: number): void {
    // 1. Play/Pause button icon
    this.playPauseBtn.textContent = isPlaying ? '⏸' : '▶';

    // 2. Scrub fill percentage
    const frac = (time / this.timeline.duration) * 100;
    this.scrubProgress.style.width = `${frac}%`;

    // 3. Timecode
    const mins = Math.floor(time / 60).toString().padStart(2, '0');
    const secs = (time % 60).toFixed(1).padStart(4, '0');
    this.timecodeDisplay.textContent = `${mins}:${secs}`;

    // 4. Active Shot indicator
    const activeShot = SHOTS[shotIdx];
    if (activeShot) {
      this.shotTitleDisplay.textContent = `0${activeShot.id} • ${activeShot.name.toUpperCase()}`;
      this.shotSubtitleDisplay.textContent = `${activeShot.subheading} • ${activeShot.focalLengthInfo}`;

      this.shotButtons.forEach((btn, idx) => {
        if (idx === shotIdx) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    this.updateZoomDisplay();
  }

  public updateZoomDisplay(): void {
    const zoom = this.cameraRig.currentZoomFactor;
    this.zoomDisplay.textContent = `${zoom.toFixed(1)}x ZOOM`;
    if (Math.abs(zoom - 1.0) > 0.05) {
      this.resetZoomBtn.style.display = 'inline-block';
    } else {
      this.resetZoomBtn.style.display = 'none';
    }
  }

  public updateMetrics(metrics: AppMetrics): void {
    const fpsEl = this.container.querySelector('#tel-fps');
    const msEl = this.container.querySelector('#tel-ms');
    const callsEl = this.container.querySelector('#tel-calls');
    const trisEl = this.container.querySelector('#tel-tris');

    if (fpsEl) fpsEl.textContent = metrics.fps.toString();
    if (msEl) msEl.textContent = `${metrics.frameTimeMs}ms`;
    if (callsEl) callsEl.textContent = metrics.drawCalls.toString();
    if (trisEl) {
      const kTris = (metrics.triangles / 1000).toFixed(1);
      trisEl.textContent = `${kTris}k`;
    }
  }
}
