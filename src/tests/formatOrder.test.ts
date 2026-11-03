import { describe, expect, it } from "vitest";
import { formatOrder, type OrderText } from "../formatOrder";

const pepperoniAndOlives: OrderText = {
    slices: 4,
    toppings: [
        { toppingName: "pepperoni", numerator: 1, denominator: 2 },
        { toppingName: "olives", numerator: 1, denominator: 2 },
    ],
    showDecimal: false,
};

describe("formatOrder", () => {
    it("writes the current order as fractions", () => {
        expect(formatOrder(pepperoniAndOlives)).toBe(
            "Cut into 4 slices. 1/2 pepperoni and 1/2 olives."
        );
    });

    it("writes the same order as decimals", () => {
        expect(formatOrder({ ...pepperoniAndOlives, showDecimal: true })).toBe(
            "Cut into 4 slices. 0.5 pepperoni and 0.5 olives."
        );
    });

    it("rounds a repeating fraction to 3 places", () => {
        expect(formatOrder({
            slices: 10,
            toppings: [{ toppingName: "basil", numerator: 1, denominator: 3 }],
            showDecimal: true,
        })).toBe("Cut into 10 slices. 0.333 basil.");
    });

    it("keeps a zero denominator as a fraction", () => {
        const text = formatOrder({
            slices: 4,
            toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 0 }],
            showDecimal: true,
        });

        expect(text).toBe("Cut into 4 slices. 1/0 pepperoni.");
        expect(text).not.toContain("Infinity");
    });

    it("does not add 'and' for a single topping", () => {
        expect(formatOrder({
            slices: 4,
            toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 4 }],
            showDecimal: true,
        })).toBe("Cut into 4 slices. 0.25 pepperoni.");
    });

    it("still includes the slice sentence when there are no toppings", () => {
        expect(formatOrder({
            slices: 4,
            toppings: [],
            showDecimal: false,
        })).toBe("Cut into 4 slices.");
    });
});
