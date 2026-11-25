import { describe, expect, it } from "vitest";
import { StockModel, firstMistake, isLightestToHeaviest, parseWeight, wrongIndexes } from "../../stock/StockModel";

const labels = ["1 lb", "2.25 lb", "5 lb", "2 1/3 lb", "0.4 lb", "3 1/2 lb", "7/5 lb", "3/5 lb"];

describe("parseWeight", () => {
    it("reads the eight delivery labels", () => {
        expect(labels.map(parseWeight)).toEqual([
            1,
            2.25,
            5,
            2 + 1 / 3,
            0.4,
            3.5,
            7 / 5,
            3 / 5,
        ]);
    });

    it("reads a whole number, a decimal, a fraction, and a mixed number", () => {
        expect(parseWeight("5")).toBe(5);
        expect(parseWeight("0.4")).toBe(0.4);
        expect(parseWeight("3/5")).toBe(3 / 5);
        expect(parseWeight("2 1/3")).toBe(2 + 1 / 3);
    });

    it("rejects a label that is not a weight", () => {
        expect(() => parseWeight("heavy")).toThrow();
    });
});

describe("isLightestToHeaviest", () => {
    const sorted = [0.4, 3 / 5, 1, 7 / 5, 2.25, 2 + 1 / 3, 3.5, 5];

    it("accepts a shelf that goes from lightest to heaviest", () => {
        expect(isLightestToHeaviest(sorted)).toBe(true);
    });

    it("rejects two neighbors that are swapped", () => {
        const swapped = [...sorted];
        [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
        expect(isLightestToHeaviest(swapped)).toBe(false);
    });

    it("rejects a tie", () => {
        const tied = [...sorted];
        tied[1] = tied[0];
        expect(isLightestToHeaviest(tied)).toBe(false);
    });

    it("marks only the boxes that are not in their sorted slot", () => {
        const weights = [0.4, 1, 3 / 5, 7 / 5, 2.25, 2 + 1 / 3, 3.5, 5];
        expect(wrongIndexes(weights)).toEqual([1, 2]);
        expect(wrongIndexes(sorted)).toEqual([]);
    });

    it("points at the first pair that is out of order", () => {
        const swapped = [...sorted];
        [swapped[3], swapped[4]] = [swapped[4], swapped[3]];
        expect(firstMistake(swapped)).toBe(3);
        expect(firstMistake(sorted)).toBe(-1);
    });

    it("rejects a shelf that is not full", () => {
        expect(isLightestToHeaviest(sorted.slice(0, 7))).toBe(false);
        expect(isLightestToHeaviest([])).toBe(false);
    });
});

describe("StockModel", () => {
    it("is sorted only after all eight slots are filled in order", () => {
        const shelf = new StockModel();
        const sorted = [0.4, 3 / 5, 1, 7 / 5, 2.25, 2 + 1 / 3, 3.5, 5];
        sorted.forEach((weight, slot) => {
            expect(shelf.place(slot, weight)).toBe(true);
        });
        expect(shelf.isFull()).toBe(true);
        expect(shelf.isSorted()).toBe(true);
    });

    it("does not put a second box in a filled slot", () => {
        const shelf = new StockModel();
        shelf.place(0, 0.4);
        expect(shelf.place(0, 1)).toBe(false);
        expect(shelf.filledCount()).toBe(1);
        expect(shelf.isSorted()).toBe(false);
    });

    it("clears a slot so the shelf can be rearranged", () => {
        const shelf = new StockModel();
        shelf.place(3, 5);
        shelf.clear(3);
        expect(shelf.filledCount()).toBe(0);
        expect(shelf.place(3, 1)).toBe(true);
    });
});
