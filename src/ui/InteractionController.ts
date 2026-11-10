import { CameraRig } from '../cinema/CameraRig';
import { Timeline } from '../cinema/Timeline';

export class InteractionController {
  private cameraRig: CameraRig;
  private timeline: Timeline;
  private onScreenshot: () => void;

  constructor(
    canvasContainer: HTMLElement,
    cameraRig: CameraRig,
    timeline: Timeline,
    onScreenshot: () => void
  ) {
    this.cameraRig = cameraRig;
    this.timeline = timeline;
    this.onScreenshot = onScreenshot;

    this.setupWheelListener(canvasContainer);
    this.setupKeyboardShortcuts();
    this.setupTouchPinch(canvasContainer);
  }

  /**
   * Non-destructive mouse wheel and trackpad zoom
   */
  private setupWheelListener(target: HTMLElement): void {
    target.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      // Normalize wheel delta across trackpads and mouse wheels
      const delta = -e.deltaY * 0.0015;
      this.cameraRig.addZoomDelta(delta);
    }, { passive: false });

    // Double-click to reset zoom
    target.addEventListener('dblclick', (e: MouseEvent) => {
      e.preventDefault();
      this.cameraRig.resetZoom();
    });
  }

  /**
   * Touch gestures (pinch to zoom)
   */
  private setupTouchPinch(target: HTMLElement): void {
    let initialDist = 0;

    target.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialDist = Math.hypot(dx, dy);
      }
    }, { passive: true });

    target.addEventListener('touchmove', (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const factor = (dist - initialDist) * 0.005;
        this.cameraRig.addZoomDelta(factor);
        initialDist = dist;
      }
    }, { passive: true });

    target.addEventListener('touchend', () => {
      initialDist = 0;
    });
  }

  /**
   * Keyboard shortcuts
   */
  private setupKeyboardShortcuts(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Ignore if user is in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          this.timeline.toggle();
          break;

        case 'KeyR':
          this.timeline.replay();
          break;

        case 'ArrowRight':
          e.preventDefault();
          this.timeline.seek(this.timeline.currentTime + 5.0);
          break;

        case 'ArrowLeft':
          e.preventDefault();
          this.timeline.seek(this.timeline.currentTime - 5.0);
          break;

        case 'Digit1':
          this.timeline.jumpToShot(0);
          break;
        case 'Digit2':
          this.timeline.jumpToShot(1);
          break;
        case 'Digit3':
          this.timeline.jumpToShot(2);
          break;
        case 'Digit4':
          this.timeline.jumpToShot(3);
          break;
        case 'Digit5':
          this.timeline.jumpToShot(4);
          break;

        case 'KeyZ':
          this.cameraRig.resetZoom();
          break;

        case 'KeyS':
          this.onScreenshot();
          break;

        case 'KeyF':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
          break;
      }
    });
  }
}
