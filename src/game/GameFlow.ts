import type { Order } from "../customer/CustomerModel";

// this class checks what customer we are on, what score it is and if the game is still going
export class GameFlow {
    round = 0 //what round/customer we are on
    score = 0 // what score it is for the number of correct pizzas
    wait = true; //its true if the customer is waiting for their pizza


    constructor(private orders: readonly Order[]) {}

    // returns the current customers order or null if the game is over
    currentOrder(): Order | null {
        return this.orders[this.round] ?? null;
    }

    
    isFinished(): boolean {
        return this.round >= this.orders.length;
    }

    // if the player presses serve, it goes to the result from the pizza check to see if the player inputted the right order
    serve(passed: boolean): void {
        if (!this.wait){
            return;
        }
        if (passed){
            this.score++;
        }
        this.wait = false;
    }

    // if the patience meter runs out, it counts as a miss in the game
    timeUp(): void {
        this.wait = false;
    }

    // if the player presses continue, we move on to the next customer
    next(): void {
        this.round++;
        this.wait = true;
    }

    // we play again from the start
    restart(): void {
        this.round = 0;
        this.score = 0;
        this.wait = true;
    }
}
