
export class PatienceMeter {
  private timeLeft: number;
  private timer: ReturnType<typeof setInterval> | null = null;
  private endTime = 0;

  constructor(
    private totalSeconds: number,
    private onUpdate: (time: number, percent: number) => void,
    private onExpired: () => void
  ) {
    this.timeLeft = totalSeconds;
  }

  // start counting down
  start(): void {
    if (this.timer !== null) return;

    this.endTime = Date.now() + this.timeLeft * 1000;

    this.timer = setInterval(() => {
      this.timeLeft = Math.max(
        0,
        (this.endTime - Date.now()) / 1000
      );

      const percent = (this.timeLeft / this.totalSeconds) * 100;
      this.onUpdate(this.timeLeft, percent);

      if (this.timeLeft === 0) {
        this.stop();
        this.onExpired();
      }
    }, 100);
  }

  // stop when pizza is served
  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // reset for another customer
  reset(): void {
    this.stop();
    this.timeLeft = this.totalSeconds;
    this.onUpdate(this.timeLeft, 100);
  }
}
