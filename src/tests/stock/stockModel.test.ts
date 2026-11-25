import { describe, expect, it } from "vitest";
import { StockModel, firstMistake, isLightestToHeaviest, parseWeight, wrongIndexes, pickWeights, WEIGHT_LABELS, SHELF_SIZE } from "../../stock/StockModel";

//lets us test pickWEights with exact same, yet random inputs everytime so we can actually predict the behavior
function fixedRandom(values: number[]): () => number {
    let i = 0;
    return () => values[i++ % values.length];
}

//takes weight label and converts it into a number that can be compared
const valueOf = (label: string) => Math.round(parseWeight(label) * 1_000_000);

// the eight original delivery labels, used by the parseWeight test
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

describe("weight bank", () => {
    it("only has labels parseWeight can read", () => {
        //for all labels
        for (const label of WEIGHT_LABELS) {
            //check each number to be a finite valid number
            expect(Number.isFinite(parseWeight(label))).toBe(true);
        }
    });

    it("has enough distinct values for a full shelf", () => {
        //calls valueOf on every weightLabel and puts them into a set and this should be greater than or equal to shelf size
        expect(new Set(WEIGHT_LABELS.map(valueOf)).size).toBeGreaterThanOrEqual(SHELF_SIZE);
    });
});

//NEW
describe("pickWeights", () => {
    it("picks a full shelf of labels from the bank", () => {
        //picks random 8 weight labels
        const picked = pickWeights();
        //is there 8 weight labels
        expect(picked).toHaveLength(SHELF_SIZE);
        //for every picked weight label
        for (const label of picked) {
            //is from the WEIGHT_LABELS bank
            expect(WEIGHT_LABELS).toContain(label);
        }
    });

    it("never picks two boxes with the same value", () => {
        // for 200 rounds
        for (let round = 0; round < 200; round++) {
            // pick 8 weight labels with valueOf called on it
            const values = pickWeights().map(valueOf);
            // put it into a set to see if duplicates exist
            expect(new Set(values).size).toBe(values.length);
        }
    });

    it("skips an equal value written a different way", () => {
        //pikc 2 weights, use predictable random numbers, with this specific weight bank
        const picked = pickWeights(2, fixedRandom([0]), ["7/5 lb", "1.4 lb", "2 lb"]);
        //only distinct values are 1.4 and 2, so size should be 2
        expect(new Set(picked.map(valueOf)).size).toBe(2);
    });

    it("gives the same result with the same random numbers", () => {
        //random array of numbers
        const random = [0.1, 0.7, 0.3, 0.9, 0.5];
        //call pickWeights twice each called with its own fixedRandom
        //both calls should receive the exact same sequence of numbers
        expect(pickWeights(SHELF_SIZE, fixedRandom(random)))
            .toEqual(pickWeights(SHELF_SIZE, fixedRandom(random)));
    });

    it("does not change the bank", () => {
        //stores a copy of WEIGHT_LABELS into before
        const before = [...WEIGHT_LABELS];
        //pick 8 random weight labels
        pickWeights();
        //check if WEIGHT_LABELS was changed
        expect(WEIGHT_LABELS).toEqual(before);
    });

    it("throws when there aren't enough distinct weights", () => {
        //pick 3 weights, use predictable random numbers, and this specific weight bank
        //should throw since only 2 unique values exist and you needed to pick 3
        expect(() => pickWeights(3, Math.random, ["7/5 lb", "1.4 lb", "2 lb"])).toThrow();
    });
});