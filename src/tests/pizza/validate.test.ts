import { describe, expect, it } from "vitest";
import { validatePizza } from "../../pizza/PizzaModel";
import type { Order } from "../../customer/CustomerModel";

const correctPlacements = [
    //100 + 100 -> sqrt200 = 14 + 30 = 44, and this is within the radius of pizza so its in pizza
    { x: 200, y: 200, radius: 30 },
    { x: 250, y: 200, radius: 30 },
    { x: 200, y: 250, radius: 30 },
    { x: 250, y: 250, radius: 30 }
]

//Assuming pizza size = 420
const outsidePizzaPlacements = [
    //190 ** 2 + (-110) ** 2 = 48200
    //sqrt(48200) = 219 + 30 (rad) = 249, which exceeds the radius of pizza
    //Placed towards the top right of the pizza
    { x: 400, y: 100, radius: 30 },

    { x: 200, y: 200, radius: 30 },
]

const pepperoniAndOlives: Order = {
    slices: 4,
    toppings: [
        { toppingName: "pepperoni", numerator: 1, denominator: 2 },
        { toppingName: "olives", numerator: 1, denominator: 2 },
    ],
    showDecimal: false,
};

const noPepperoniOrder: Order = {
    slices: 5,
    toppings: [
        { toppingName: "pepperoni", numerator: 0, denominator: 4 },
    ],
    showDecimal: false
};

describe("validatePizza", () => {
    
    it("Accepts pizza that meets the specifications of the order, and the toppings are on the pizza", () => {
        expect(
            validatePizza(
                pepperoniAndOlives, 
                4, //slices
                {
                    toppings:{pepperoni: 2, olives: 2}, 
                    placedToppings: correctPlacements,
                    pizzaSize: 420
                }
            )
        ).toBe(true);
    })

    it("Rejects pizza that doesnt meet the right number of slices", () => {
        expect(
            validatePizza(
                pepperoniAndOlives, 
                3, 
                {
                    toppings:{pepperoni: 2, olives: 2}, 
                    placedToppings: correctPlacements,
                    pizzaSize: 420
                }
            )
        ).toBe(false);
    })

    it("Rejects pizza that doesnt have the right amount of toppings on it", () => {
        expect(
            validatePizza(
                pepperoniAndOlives, 
                4, 
                {
                    toppings:{pepperoni: 1, olives: 2}, 
                    placedToppings: correctPlacements.slice(0, 3),
                    pizzaSize: 420
                }
            )
        ).toBe(false);
    })

    it("Rejects Pizza that doesnt have a certain topping on it", () => {
        expect(
            validatePizza(
                pepperoniAndOlives, 
                4, 
                {
                    toppings:{olives: 2}, 
                    placedToppings: [
                        { x: 200, y: 200, radius: 30 },
                        { x: 250, y: 200, radius: 30 },
                    ],
                    pizzaSize:420
                }
            )
        ).toBe(false);
    })

    it("Rejects pizza that doesnt have the coorect toppings on it", () => {
        expect(
            validatePizza(
                pepperoniAndOlives, 
                4, 
                {
                    toppings: {onions: 2, olives: 2},
                    placedToppings: correctPlacements, 
                    pizzaSize: 420
                }
            )
        ).toBe(false);
    })

    it("Rejects pizza that has no toppings on it when a pizza specification wants toppings", () => {
        expect(
            validatePizza(
                pepperoniAndOlives, 
                4, 
                {
                    toppings: {}, 
                    placedToppings: [], 
                    pizzaSize: 420
                }
            )
        ).toBe(false);
    })

    it("accepts no toppings on a pizza when a speicifc order doesnt want toppings", () => {
        expect(
            validatePizza(
                noPepperoniOrder,
                5, 
                {
                    toppings: {pepperonio: 0}, 
                    placedToppings: [], 
                    pizzaSize:420
                }
            )
        ).toBe(true); 
    })

    //Add test that checks for extra toppings that is not on customer specs 
    it("denies pizzas that has extra toppings on it", () => {
        const pepperonibasilOrder: Order = {
            slices: 8,
            toppings: [
                { toppingName: "pepperoni", numerator: 2, denominator: 4 },
                { toppingName: "basil", numerator:1, denominator:8}
            ],
            showDecimal: false
        }; 

        expect(
            validatePizza(
                pepperonibasilOrder,
                8, 
                {
                    toppings: {pepperoni: 4, basil:1, olives:3},
                    placedToppings: [
                        { x: 200, y: 200, radius: 30 },
                        { x: 250, y: 200, radius: 30 },
                        { x: 200, y: 250, radius: 30 },
                        { x: 250, y: 250, radius: 30 }, 
                        { x: 200, y: 200, radius: 30 },
                        { x: 250, y: 200, radius: 30 },
                        { x: 200, y: 250, radius: 30 },
                        { x: 250, y: 250, radius: 30 }
                    ], 
                    pizzaSize:420
                }
            )
        ).toBe(false); 
    })

    it("denies a pizza that correct number of toppings, but is placed outside of the pizza", () => {
        const pepPizza: Order = {
            slices:2, 
            toppings: [
                { toppingName: "pepperoni", numerator:1, denominator:1}
            ],
            showDecimal: false
        }

        expect(
            validatePizza(
                pepPizza,
                2, 
                {
                    toppings: {pepperoni: 2},
                    placedToppings: outsidePizzaPlacements,
                    pizzaSize:420
                }
            )
        ).toBe(false); 
    })

})
