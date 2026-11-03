
export class PatienceMeter {
  private timeLeft: number;
  //stores the interval ID so we can stop the countdown later
  //setInterval: function that repeatedly executes code
  //= null means no interval has been started yet
  private timer: ReturnType<typeof setInterval> | null = null;
  //store the exact time when patience should reach 0
  private endTime = 0;

  constructor(
    //specifies how long the customer has before their patience reaches zero
    private totalSeconds: number,
    //callback function: tells the game interface how many seconds remain + patience percentage
    private onUpdate: (time: number, percent: number) => void,
    //callback function: runs when patience is 0%
    private onExpired: () => void
  ) {
    this.timeLeft = totalSeconds;
  }

  // start counting down
  start(): void {
    //prevents the game from accidentally starting multiple countdown intervals for the same customer
    if (this.timer !== null) return;

    //JavaScript measures timestamps in milliseconds
    this.endTime = Date.now() + this.timeLeft * 1000;

    this.timer = setInterval(() => {
      this.timeLeft = Math.max(
        0,
        (this.endTime - Date.now()) / 1000
      );

      const percent = (this.timeLeft / this.totalSeconds) * 100;
      //Updating the game interface
      this.onUpdate(this.timeLeft, percent);

      if (this.timeLeft === 0) {
        this.stop();
        this.onExpired();
      }
    }, 100); //code attempts to update the timer 10 times per second
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
