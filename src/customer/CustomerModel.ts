// Order is the shared customer description. The game and the pizza check both import it from here.

// 4 toppings that the player can drag from the tray to the pizza
export const toppingNames = ['pepperoni', 'onions', 'olives', 'basil'] as const;

// only allows the 4 topping names
export type toppingName = (typeof toppingNames)[number];


// describes the interfaces for slices (1-10), each topping and the fraction of pizza it needs to cover
export interface Order {

    slices: number;
    toppings: {
        toppingName: string;
        numerator: number;
        denominator: number;
    }[];

    //true shows decimals, false shows fractions
    showDecimal: boolean;
  
}

//this describes the customers orders, it gets progressively harder
export const orders: readonly Order[] = [

    // one topping on half the pizza
    {
        slices: 2, 
        toppings: [{toppingName: "pepperoni", numerator: 1, denominator: 2}], 
        showDecimal: true
    },

    // two toppings, half each
    {
        slices: 4, 
        toppings: [
            {toppingName: "pepperoni", numerator: 1, denominator: 2},
            {toppingName: "olives", numerator: 1, denominator: 2},
        ],
        showDecimal: true
    },

    // quarters, this is shown in fractions
    {
        slices: 4, 
        toppings: [
            {toppingName: "pepperoni", numerator: 1, denominator: 4},
            {toppingName: "olives", numerator: 3, denominator: 4},
        ],
        showDecimal: false
    },

    // shown in thirds
    {
        slices: 3, 
        toppings: [
            {toppingName: "olives", numerator: 1, denominator: 3},
            {toppingName: "pepperoni", numerator: 2, denominator: 3},
        ],
        showDecimal: false
    },

    // 3 toppings with different denominators
    {
        slices: 6, 
        toppings: [
            {toppingName: "pepperoni", numerator: 1, denominator: 2},
            {toppingName: "onions", numerator: 1, denominator: 3},
            {toppingName: "basil", numerator: 1, denominator: 6},
        ],
        showDecimal: false
    },
    

];

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
