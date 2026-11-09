import { describe, expect, it} from "vitest";
import {GameFlow} from "../../game/GameFlow";
import { orders } from "../../customer/CustomerModel";

describe("GameFlow", () => {

    // if validator says that the pizza is right, the point goes up by 1
    it("increments the score for a correct pizza order", () => {
        const game = new GameFlow(orders);
        game.serve(true);
        expect(game.score).toBe(1)
    });

    // if validator says that the pizza is wrong, no points
    it("does not increment the score for a wrong pizza order", () => {
        const game = new GameFlow(orders);
        game.serve(false);
        expect(game.score).toBe(0)
    });

    //player presses continue, and second order in the list is now the current order
    it("moves on to the next customers order after player clicks continue", () => {
        const game = new GameFlow(orders);
        game.serve(true);
        game.next();
        expect(game.currentOrder()).toBe(orders[1]);
    });

    // the loop serves every customer correctly and presses continue
    // when there are no customers left, game is over
    // score is the number of orders that are correct
    it("game ends after the last customer's order is complete", () => {
        const game = new GameFlow(orders);
        for (let i = 0; i < orders.length; i++){
            game.serve(true)
            game.next();
        }
        expect(game.isFinished()).toBe(true);
        expect(game.currentOrder()).toBeNull();
        expect(game.score).toBe(orders.length);
        
    });

    // if the player presses play again the score resets and the game goes back to the first customer
    it("restarting the game resets the game and goes back to the first customer with a score of 0", () => {
        const game = new GameFlow(orders);
        game.serve(true)
        game.next();
        game.restart();
       
        expect(game.score).toBe(0);
        expect(game.currentOrder()).toBe(orders[0]);
    });



});