import { SHOTS } from './Storyboard';

export type TimeUpdateCallback = (time: number, isPlaying: boolean, shotIndex: number) => void;

export class Timeline {
  public currentTime: number = 0.0;
  public readonly duration: number = 60.0;
  public isPlaying: boolean = true;
  public playbackRate: number = 1.0;

  private onUpdateCallbacks: TimeUpdateCallback[] = [];

  constructor() {
    this.currentTime = 0.0;
    this.isPlaying = true;
  }

  public subscribe(cb: TimeUpdateCallback): void {
    this.onUpdateCallbacks.push(cb);
  }

  public play(): void {
    this.isPlaying = true;
    this.notify();
  }

  public pause(): void {
    this.isPlaying = false;
    this.notify();
  }

  public toggle(): void {
    this.isPlaying = !this.isPlaying;
    this.notify();
  }

  public replay(): void {
    this.currentTime = 0.0;
    this.isPlaying = true;
    this.notify();
  }

  public seek(time: number): void {
    this.currentTime = Math.max(0.0, Math.min(this.duration, time));
    this.notify();
  }

  public jumpToShot(shotIndex: number): void {
    if (shotIndex >= 0 && shotIndex < SHOTS.length) {
      this.seek(SHOTS[shotIndex].startTime);
    }
  }

  public tick(dt: number): void {
    if (!this.isPlaying) return;

    this.currentTime += dt * this.playbackRate;

    if (this.currentTime >= this.duration) {
      // Loop seamlessly or rewind
      this.currentTime = 0.0;
    }

    this.notify();
  }

  private notify(): void {
    const shotIdx = this.getShotIndex();
    for (const cb of this.onUpdateCallbacks) {
      cb(this.currentTime, this.isPlaying, shotIdx);
    }
  }

  public getShotIndex(): number {
    for (let i = 0; i < SHOTS.length; i++) {
      if (this.currentTime >= SHOTS[i].startTime && this.currentTime < SHOTS[i].endTime) {
        return i;
      }
    }
    return SHOTS.length - 1;
  }
}
