import { describe, expect, it } from "vitest";
import { validatePizza } from "../validate";
import type { Order } from "../game";

const pepperoniAndOlives: Order = {
    slices: 4,
    toppings: [
        { toppingName: "pepperoni", numerator: 1, denominator: 2 },
        { toppingName: "olives", numerator: 1, denominator: 2 },
    ],
    showDecimal: false,
};

describe("validatePizza", () => {
    it("Accepts pizza that meets the specifications of the order.", () => {
        expect(validatePizza(pepperoniAndOlives, 4, {pepperoni: 2, olives: 2})).toBe(true);
    })

    it("Rejects pizza that doesnt meet the right number of slices", () => {
        expect(validatePizza(pepperoniAndOlives, 3, {pepperoni: 2, olives: 2})).toBe(false);
    })

    it("Rejects pizza that doesnt have the right amount of toppings on it", () => {
        expect(validatePizza(pepperoniAndOlives, 4, {pepperoni: 1, olives: 2})).toBe(false);
    })

    it("Rejects Pizza that doesnt have a certain topping on it", () => {
        expect(validatePizza(pepperoniAndOlives, 4, {olives: 2})).toBe(false);
    })

    it("Rejects pizza that doesnt have the coorect toppings on it", () => {
        expect(validatePizza(pepperoniAndOlives, 4, {onions: 2, olives: 2})).toBe(false);
    })

    it("Rejects pizza that has no toppings on it when a pizza specification wants toppings", () => {
        expect(validatePizza(pepperoniAndOlives, 4, {})).toBe(false);
    })

    it("accepts no toppings on a pizza when a speicifc order doesnt want toppings", () => {
        const noPepperoniOrder: Order = {
            slices: 4,
            toppings: [
                { toppingName: "pepperoni", numerator: 0, denominator: 4 },
            ],
            showDecimal: false
        };

        expect(validatePizza(noPepperoniOrder, 4, {pepperoni: 0})).toBe(true); 
    })
})
