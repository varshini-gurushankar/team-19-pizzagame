import { describe, expect, it } from "vitest";
import {orders, toppingNames} from "../../customer/CustomerModel";
import {validatePizza} from "../../pizza/PizzaModel";


// i wrote these tests so every order can be built in the game and we can catch any impossible orders
describe("orders", () => {

    // game needs atleast one customer to play
    it("has atleast one order", () =>{
        expect(orders.length).toBeGreaterThan(0);
    })

    // the slider only has slices 1 through 10 and the game needs to be played in this window
    it("every order is between 1 and 10 slices", () =>{
        for (const order of orders){
            expect(order.slices).toBeGreaterThanOrEqual(1);
            expect(order.slices).toBeLessThanOrEqual(10);

        }
        
    });

    // player can only drag the toppings (pepperoni, onions, olives, basil) to the tray
    it("only use toppings in the tray", () =>{
        for (const order of orders){
            for (const topping of order.toppings){
                expect(toppingNames).toContain(topping.toppingName);
            }
            

        }
        
    });

    // you can have 1/2 of 4 slices which is 2, but having 1/4 of 6 slices is 1.5 and this can't be possible for this game
    it("each topping covers a whole number slice", () =>{
        for (const order of orders){
            for (const topping of order.toppings){
                const toppingSlice = (topping.numerator * order.slices) / topping.denominator;
                expect(Number.isInteger(toppingSlice)).toBe(true);
            }
            

        }
        
    });

    // we add up how ever many slices all the toppings need together and we cant need more slices than the pizza has
    it("toppings don't add up to more than the whole pizza itself", () => {
        for (const order of orders){
            let sliceUsed = 0;
            for (const topping of order.toppings){
                sliceUsed += (topping.numerator * order.slices) / topping.denominator;

            }
            expect(sliceUsed).toBeLessThanOrEqual(order.slices);

        }

        
    });

    // we need to build the correct pizza asked in the question to pass validator and win
    it("each order passes validator if it is built accurately", () => {
        for (const order of orders){
            
            const toppingonPizza: Record<string, number> = {};
            for (const topping of order.toppings){
                toppingonPizza[topping.toppingName] =
                    (topping.numerator * order.slices) / topping.denominator;

            }

            const placedToppings = [];

            for (const toppingName in toppingonPizza) {
                const count = toppingonPizza[toppingName];
                for (let i = 0; i < count; i++) {
                    placedToppings.push({
                        x: 210 + i,
                        y: 210 + i,
                        radius: 30,
                    });
                }
            }

            expect(validatePizza(order, order.slices, 
                {   toppings:toppingonPizza, 
                    placedToppings,
                    pizzaSize:420,
                }   
            )).toBe(true);

        }

        
    });
});
