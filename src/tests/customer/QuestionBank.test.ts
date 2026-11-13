import { describe, it, expect } from "vitest";
import {
    questions,
    difficulties,
    getQuestionById,
    getQuestionsByIds,
    getQuestionsByDifficulty,
    type Question,
} from "../../customer/QuestionBank";
import { toppingNames } from "../../customer/CustomerModel";
import { validatePizza } from "../../pizza/PizzaModel";
import { MIN_SLICES, MAX_SLICES } from "../../pizza/sliceLimits";

// this number represents the number of questions needed so that we dont repeat questions in the 
// same day (not sure what this number should be yet)
const MIN_QUESTIONS_PER_DIFFICULTY = 5;

// finds greatest common denominator of two numbers
function gcd(a: number, b: number): number {
    // if b is 0 return a, else recurse
    return b === 0 ? a : gcd(b, a % b);
}

// given the numerator, denominator, and number of slices, returns how many slices need that topping
function slicesCovered(numerator: number, denominator: number, slices: number): number {
    return (numerator * slices) / denominator;
}

// checks if the fraction is able to be rewritten as a nice decimal and not a infinitely repeating one
function isExactDecimal(denominator: number): boolean {
    // a property of an infinitely repeating decimal is that its denominator contains 
    // at least one prime factor other than 2 or 5
    let remaining = denominator;
    while (remaining % 2 === 0) remaining /= 2;
    while (remaining % 5 === 0) remaining /= 5;
    return remaining === 1;
}

// make object that is the answer for the question given and returns a record
function buildCorrectPizza(question: Question): Record<string, number> {
    // makes toppings object
    const toppings: Record<string, number> = {};
    // for every topping
    for (const topping of question.toppings) {
        //use topping name as object property name
        toppings[topping.toppingName] =
            // calculates how many slices the topping should be on
            slicesCovered(topping.numerator, topping.denominator, question.slices);
    }
    return toppings;
}

describe("question bank", () => {
    it("gives every question a unique ID", () => {
        // make map array containing only ids and nothing else
        const ids = questions.map((question) => question.id);
        // sets store unique values only, no duplicates
        // set should have same amount of ids as questions if all ids are unique
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("uses the q + number ID format", () => {
        // for every question in questionBank
        for (const question of questions) {
            /**
             *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
             *  ^ is beginning of the string
             *  q means that every id must begin with q
             *  \d means that it is a digit 0-9
             *  + means one or more digits
             *  $ is the end of the string
             */
            expect(question.id).toMatch(/^q\d+$/);
        }
    });

    // for every difficulty
    it.each(difficulties)("has enough %s questions for a full day", (difficulty) => {
        expect(getQuestionsByDifficulty(difficulty).length)
            .toBeGreaterThanOrEqual(MIN_QUESTIONS_PER_DIFFICULTY);
    });

    it("has no duplicate questions (same slices, display, and toppings)", () => {
        // makes a string for every question in the keys array
        const keys = questions.map((question) => {
            const toppings = question.toppings
                // formats every topping into an array like "pepperoni:1/2", etc.
                .map((t) => `${t.toppingName}:${t.numerator}/${t.denominator}`)
                // then sorts alphabetically so if order of toppings is different is still 
                // recognized as a duplicate if they are the same thing
                .sort()
                // make them as one string
                .join(",");
                // EX: 6|true|mushrooms:1/3,pepperoni:1/2
            return `${question.slices}|${question.showDecimal}|${toppings}`;
        });
        // sets only store unique values
        // so unique amount of keys should be as big as total number of keys if every question is 
        // unique
        expect(new Set(keys).size).toBe(keys.length);
    });
});

// checks every question, failure names the question that failed
describe.each(questions)("question $id", (question) => {
    it("uses a whole number of slices the slider allows", () => {
        //is it whole num
        expect(Number.isInteger(question.slices)).toBe(true);
        //is x >= MIN_SLICES
        expect(question.slices).toBeGreaterThanOrEqual(MIN_SLICES);
        //is x <= MAX_SLICES
        expect(question.slices).toBeLessThanOrEqual(MAX_SLICES);
    });

    it("asks for at least one topping", () => {
        expect(question.toppings.length).toBeGreaterThan(0);
    });

    it("only uses toppings from the tray, each at most once", () => {
        // makes map array of the topping names in the question
        const names = question.toppings.map((topping) => topping.toppingName);
        // for every topping name check that it actually is a topping we implemented
        for (const name of names) {
            expect(toppingNames).toContain(name);
        }
        // set removes duplicates, so if we don't repeat toppings then they should be same length
        expect(new Set(names).size).toBe(names.length);
    });

    it("uses proper fractions in lowest terms", () => {
        //extracts the numerator and denominator part of the questions property
        for (const { numerator, denominator } of question.toppings) {
            //are they whole numbers
            expect(Number.isInteger(numerator)).toBe(true);
            expect(Number.isInteger(denominator)).toBe(true);

            //is it not 0
            expect(numerator).toBeGreaterThan(0);

            //is it actually a fraction of 1
            expect(numerator).toBeLessThanOrEqual(denominator);

            //is the fraction already simplified
            expect(gcd(numerator, denominator)).toBe(1);
        }
    });

    it("gives each topping a whole number of slices", () => {
        //extracts the numerator and denominator part of the questions property
        for (const { numerator, denominator } of question.toppings) {
            // calculates how many slices the toppings should be on
            const covered = slicesCovered(numerator, denominator, question.slices);
            // is it a whole number
            expect(Number.isInteger(covered)).toBe(true);
        }
    });

    it("never needs more than the whole pizza", () => {
        //goes through an array and combines the values into a single result
        const total = question.toppings.reduce(
            // for every topping take the sum and extract the numerator and denominator from the fraction
            (sum, { numerator, denominator }) =>
                // increment sum by how many slices need to be covered by toppings for each topping
                sum + slicesCovered(numerator, denominator, question.slices),
            //sum begins at 0
            0
        );
        //make sure that total amount of slices that need to be covered does not exceed the 
        // amount of slices is asked
        expect(total).toBeLessThanOrEqual(question.slices);
    });

    it("only shows decimals that are exact (no 0.333...)", () => {
        // if the question shows decimal
        if (!question.showDecimal) return;
        // for every topping take the denominator
        for (const { denominator } of question.toppings) {
            //check if the denominator is an exact decimal
            expect(isExactDecimal(denominator)).toBe(true);
        }
    });

    it("is accepted by the validator when built correctly", () => {
        //calls validatePizza with the question, how many slices, and the correct answer
        expect(validatePizza(question, question.slices, buildCorrectPizza(question))).toBe(true);
    });

    it("is rejected by the validator when a topping is missing a piece", () => {
        // makes the correct answer
        const pizza = buildCorrectPizza(question);
        // gets name of first topping in the questions topping array
        const firstTopping = question.toppings[0].toppingName;
        // removes one slice from the first topping, to make it incorrect
        pizza[firstTopping] -= 1;

        //should be wrong
        expect(validatePizza(question, question.slices, pizza)).toBe(false);
    });
});

describe("getQuestionById", () => {
    it("returns the question with that ID", () => {
        // stores question with id q14 into question
        const question = getQuestionById("q14");
        // does that question have the correct id
        expect(question?.id).toBe("q14");
        // does it have the correct slices
        expect(question?.slices).toBe(6);
    });

    it("returns undefined for an unknown ID", () => {
        expect(getQuestionById("q999")).toBeUndefined();
        expect(getQuestionById("")).toBeUndefined();
    });
});

describe("getQuestionsByIds", () => {
    it("returns the questions in the order the IDs were given", () => {
        //asks for q20 and q03
        const result = getQuestionsByIds(["q20", "q03"]);
        //makes array of the IDs of the asked questions ^^^ and makes sure that it matches expected output
        expect(result.map((question) => question.id)).toEqual(["q20", "q03"]);
    });

    it("skips IDs that don't exist", () => {
        //gets questions with these ids
        // removed-question isnt a valid id
        const result = getQuestionsByIds(["q01", "removed-question", "q02"]);
        // the unvalid id should not exist in the array
        expect(result.map((question) => question.id)).toEqual(["q01", "q02"]);
    });

    it("returns an empty list for no IDs", () => {
        // if no ids are requested, then nothing should be in the list
        expect(getQuestionsByIds([])).toEqual([]);
    });
});

describe("getQuestionsByDifficulty", () => {
    // for every difficulty
    it.each(difficulties)("only returns %s questions", (difficulty) => {
        //loops through all questions of a specific difficulty
        for (const question of getQuestionsByDifficulty(difficulty)) {
            //check if the returned question has a difficulty equal to the request difficulty
            expect(question.difficulty).toBe(difficulty);
        }
    });

    it("puts every question in exactly one difficulty", () => {
        // combines all of the difficulty values into one number
        const total = difficulties.reduce(
            // for every difficulty get the amount of questions in that difficulty
            // do .length to find number of questions
            // add it to total
            (sum, difficulty) => sum + getQuestionsByDifficulty(difficulty).length,
            // sum begins at 0
            0
        );
        // the sum of all the difficulty groups should be equal to the total number of questions
        expect(total).toBe(questions.length);
    });
});