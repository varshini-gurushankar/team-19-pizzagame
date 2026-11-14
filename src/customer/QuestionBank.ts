import type { Order, toppingName as ToppingName } from "./CustomerModel";

/*
 * all the order with ids
 *
 * some notes :
 * - I made the ids permanent so that task 3 is able to use the ids for missed-questions and 
 *   save them between the days
 *   but this means to NEVER change the id or reuse the same ID for another question
 *   so if youre making a new question just continue onto the next unused id number
 * - if you want to delete a question, you can without having to update the rest of the ids,
 *   since IDs that don't exist are just skipped
 *
 * how I defined difficulty:
 * - easy questions:
 *        - 1 topping 
 *        - 2-6 slices
 *        - denominator = slices needed
 *        - or just 1/2
 * 
 * - medium questions:
 *        - 1-2 toppings
 *        - 3-8 slices
 *        - equivalent fractions 
 *                - EX: 1/2 of 6 slices = 3
 *                - EX: 0.25 or 0.75 decimals
 * 
 * - hard questions:
 *        - 2-3 toppings
 *        - 6-10 slices
 *        - decimals like 0.1, 0.125, 0.3
 */

//array of strings for the three difficulties
export const difficulties = ["easy", "medium", "hard"] as const;

// makes a type called Difficulty that only accepts these three strings
// prevents someone from making a question with other difficulty aliases like beginner or extreme
export type Difficulty = (typeof difficulties)[number];

// question properties inherits properties of order
// 
export interface Question extends Order {
    id: string;
    difficulty: Difficulty;
    toppings: {
        //in order this is a string, so I redefined it, so that you can only use a valid topping
        toppingName: ToppingName;
        numerator: number;
        denominator: number;
    }[];
}

// made it readonly so that the questionbank doesn't randomly change while the game is running
export const questions: readonly Question[] = [

  // ----------------------------- EASY ---------------------------------//
    { id: "q01", difficulty: "easy", slices: 2, showDecimal: true,
      toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 2 }] },

    { id: "q02", difficulty: "easy", slices: 2, showDecimal: false,
      toppings: [{ toppingName: "olives", numerator: 1, denominator: 2 }] },

    { id: "q03", difficulty: "easy", slices: 3, showDecimal: false,
      toppings: [{ toppingName: "basil", numerator: 1, denominator: 3 }] },

    { id: "q04", difficulty: "easy", slices: 3, showDecimal: false,
      toppings: [{ toppingName: "pepperoni", numerator: 2, denominator: 3 }] },

    { id: "q05", difficulty: "easy", slices: 4, showDecimal: false,
      toppings: [{ toppingName: "onions", numerator: 1, denominator: 4 }] },

    { id: "q06", difficulty: "easy", slices: 4, showDecimal: false,
      toppings: [{ toppingName: "olives", numerator: 3, denominator: 4 }] },

    { id: "q07", difficulty: "easy", slices: 4, showDecimal: true,
      toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 2 }] },

    { id: "q08", difficulty: "easy", slices: 5, showDecimal: false,
      toppings: [{ toppingName: "basil", numerator: 2, denominator: 5 }] },

    { id: "q26", difficulty: "easy", slices: 2, showDecimal: false,
      toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 2 }] },

    { id: "q27", difficulty: "easy", slices: 2, showDecimal: true,
      toppings: [{ toppingName: "onions", numerator: 1, denominator: 2 }] },

    { id: "q28", difficulty: "easy", slices: 2, showDecimal: false,
      toppings: [{ toppingName: "basil", numerator: 1, denominator: 2 }] },

    { id: "q29", difficulty: "easy", slices: 3, showDecimal: false,
      toppings: [{ toppingName: "olives", numerator: 1, denominator: 3 }] },

    { id: "q30", difficulty: "easy", slices: 3, showDecimal: false,
      toppings: [{ toppingName: "onions", numerator: 2, denominator: 3 }] },

    { id: "q31", difficulty: "easy", slices: 4, showDecimal: false,
      toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 4 }] },

    { id: "q32", difficulty: "easy", slices: 4, showDecimal: false,
      toppings: [{ toppingName: "basil", numerator: 1, denominator: 4 }] },

    { id: "q33", difficulty: "easy", slices: 4, showDecimal: false,
      toppings: [{ toppingName: "pepperoni", numerator: 3, denominator: 4 }] },

    { id: "q34", difficulty: "easy", slices: 4, showDecimal: false,
      toppings: [{ toppingName: "onions", numerator: 3, denominator: 4 }] },

    { id: "q35", difficulty: "easy", slices: 4, showDecimal: true,
      toppings: [{ toppingName: "olives", numerator: 1, denominator: 2 }] },

    { id: "q36", difficulty: "easy", slices: 4, showDecimal: false,
      toppings: [{ toppingName: "basil", numerator: 1, denominator: 2 }] },

    { id: "q37", difficulty: "easy", slices: 5, showDecimal: false,
      toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 5 }] },

    { id: "q38", difficulty: "easy", slices: 5, showDecimal: false,
      toppings: [{ toppingName: "olives", numerator: 3, denominator: 5 }] },

    { id: "q39", difficulty: "easy", slices: 5, showDecimal: false,
      toppings: [{ toppingName: "onions", numerator: 1, denominator: 5 }] },

    { id: "q40", difficulty: "easy", slices: 5, showDecimal: false,
      toppings: [{ toppingName: "basil", numerator: 4, denominator: 5 }] },

    { id: "q41", difficulty: "easy", slices: 6, showDecimal: false,
      toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 6 }] },

    { id: "q42", difficulty: "easy", slices: 6, showDecimal: false,
      toppings: [{ toppingName: "olives", numerator: 5, denominator: 6 }] },

  // ----------------------------- MEDIUM ---------------------------------//

    { id: "q09", difficulty: "medium", slices: 4, showDecimal: true,
      toppings: [
          { toppingName: "pepperoni", numerator: 1, denominator: 2 },
          { toppingName: "olives", numerator: 1, denominator: 2 },
      ] },

    { id: "q10", difficulty: "medium", slices: 4, showDecimal: false,
      toppings: [
          { toppingName: "pepperoni", numerator: 1, denominator: 4 },
          { toppingName: "olives", numerator: 3, denominator: 4 },
      ] },

    { id: "q11", difficulty: "medium", slices: 3, showDecimal: false,
      toppings: [
          { toppingName: "olives", numerator: 1, denominator: 3 },
          { toppingName: "pepperoni", numerator: 2, denominator: 3 },
      ] },

    { id: "q12", difficulty: "medium", slices: 4, showDecimal: true,
      toppings: [{ toppingName: "onions", numerator: 1, denominator: 4 }] },

    { id: "q13", difficulty: "medium", slices: 4, showDecimal: true,
      toppings: [{ toppingName: "basil", numerator: 3, denominator: 4 }] },

    { id: "q14", difficulty: "medium", slices: 6, showDecimal: false,
      toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 2 }] },

    { id: "q15", difficulty: "medium", slices: 5, showDecimal: true,
      toppings: [{ toppingName: "onions", numerator: 2, denominator: 5 }] },

    { id: "q16", difficulty: "medium", slices: 6, showDecimal: false,
      toppings: [
          { toppingName: "olives", numerator: 1, denominator: 3 },
          { toppingName: "basil", numerator: 1, denominator: 6 },
      ] },

    { id: "q17", difficulty: "medium", slices: 8, showDecimal: true,
      toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 4 }] },

   { id: "q43", difficulty: "medium", slices: 4, showDecimal: true,
      toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 4 }] },

    { id: "q44", difficulty: "medium", slices: 4, showDecimal: true,
      toppings: [{ toppingName: "olives", numerator: 3, denominator: 4 }] },

    { id: "q45", difficulty: "medium", slices: 5, showDecimal: true,
      toppings: [{ toppingName: "pepperoni", numerator: 3, denominator: 5 }] },

    { id: "q46", difficulty: "medium", slices: 5, showDecimal: true,
      toppings: [{ toppingName: "olives", numerator: 4, denominator: 5 }] },

    { id: "q47", difficulty: "medium", slices: 5, showDecimal: true,
      toppings: [{ toppingName: "basil", numerator: 1, denominator: 5 }] },

    { id: "q48", difficulty: "medium", slices: 6, showDecimal: false,
      toppings: [{ toppingName: "olives", numerator: 1, denominator: 2 }] },

    { id: "q49", difficulty: "medium", slices: 6, showDecimal: false,
      toppings: [{ toppingName: "basil", numerator: 1, denominator: 3 }] },

    { id: "q50", difficulty: "medium", slices: 6, showDecimal: false,
      toppings: [{ toppingName: "pepperoni", numerator: 2, denominator: 3 }] },

    { id: "q51", difficulty: "medium", slices: 8, showDecimal: true,
      toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 2 }] },

    { id: "q52", difficulty: "medium", slices: 8, showDecimal: false,
      toppings: [{ toppingName: "olives", numerator: 1, denominator: 4 }] },

    { id: "q53", difficulty: "medium", slices: 8, showDecimal: true,
      toppings: [{ toppingName: "onions", numerator: 3, denominator: 4 }] },

    { id: "q54", difficulty: "medium", slices: 4, showDecimal: true,
      toppings: [
          { toppingName: "olives", numerator: 1, denominator: 2 },
          { toppingName: "basil", numerator: 1, denominator: 4 },
      ] },

    { id: "q55", difficulty: "medium", slices: 3, showDecimal: false,
      toppings: [
          { toppingName: "pepperoni", numerator: 1, denominator: 3 },
          { toppingName: "onions", numerator: 1, denominator: 3 },
      ] },

    { id: "q56", difficulty: "medium", slices: 5, showDecimal: true,
      toppings: [
          { toppingName: "pepperoni", numerator: 2, denominator: 5 },
          { toppingName: "olives", numerator: 3, denominator: 5 },
      ] },

    { id: "q57", difficulty: "medium", slices: 6, showDecimal: false,
      toppings: [
          { toppingName: "pepperoni", numerator: 1, denominator: 2 },
          { toppingName: "basil", numerator: 1, denominator: 3 },
      ] },

    { id: "q58", difficulty: "medium", slices: 8, showDecimal: true,
      toppings: [
          { toppingName: "onions", numerator: 1, denominator: 2 },
          { toppingName: "olives", numerator: 1, denominator: 4 },
      ] },

  // ----------------------------- HARD ---------------------------------//

    { id: "q18", difficulty: "hard", slices: 6, showDecimal: false,
      toppings: [
          { toppingName: "pepperoni", numerator: 1, denominator: 2 },
          { toppingName: "onions", numerator: 1, denominator: 3 },
          { toppingName: "basil", numerator: 1, denominator: 6 },
      ] },

    { id: "q19", difficulty: "hard", slices: 8, showDecimal: true,
      toppings: [
          { toppingName: "pepperoni", numerator: 1, denominator: 2 },
          { toppingName: "olives", numerator: 1, denominator: 4 },
          { toppingName: "onions", numerator: 1, denominator: 8 },
      ] },

    { id: "q20", difficulty: "hard", slices: 10, showDecimal: true,
      toppings: [
          { toppingName: "basil", numerator: 3, denominator: 10 },
          { toppingName: "pepperoni", numerator: 1, denominator: 2 },
      ] },

    { id: "q21", difficulty: "hard", slices: 10, showDecimal: true,
      toppings: [
          { toppingName: "olives", numerator: 2, denominator: 5 },
          { toppingName: "onions", numerator: 1, denominator: 10 },
      ] },

    { id: "q22", difficulty: "hard", slices: 8, showDecimal: false,
      toppings: [
          { toppingName: "pepperoni", numerator: 3, denominator: 8 },
          { toppingName: "basil", numerator: 1, denominator: 4 },
          { toppingName: "olives", numerator: 3, denominator: 8 },
      ] },

    { id: "q23", difficulty: "hard", slices: 9, showDecimal: false,
      toppings: [
          { toppingName: "onions", numerator: 2, denominator: 3 },
          { toppingName: "olives", numerator: 1, denominator: 9 },
      ] },

    { id: "q24", difficulty: "hard", slices: 10, showDecimal: true,
      toppings: [
          { toppingName: "pepperoni", numerator: 3, denominator: 5 },
          { toppingName: "olives", numerator: 1, denominator: 5 },
          { toppingName: "basil", numerator: 1, denominator: 10 },
      ] },

    { id: "q25", difficulty: "hard", slices: 6, showDecimal: false,
      toppings: [
          { toppingName: "olives", numerator: 2, denominator: 3 },
          { toppingName: "pepperoni", numerator: 1, denominator: 6 },
      ] },

{ id: "q59", difficulty: "hard", slices: 6, showDecimal: false,
      toppings: [
          { toppingName: "olives", numerator: 1, denominator: 2 },
          { toppingName: "pepperoni", numerator: 1, denominator: 3 },
      ] },

    { id: "q60", difficulty: "hard", slices: 6, showDecimal: false,
      toppings: [
          { toppingName: "onions", numerator: 1, denominator: 2 },
          { toppingName: "basil", numerator: 1, denominator: 6 },
      ] },

    { id: "q61", difficulty: "hard", slices: 6, showDecimal: false,
      toppings: [
          { toppingName: "basil", numerator: 2, denominator: 3 },
          { toppingName: "onions", numerator: 1, denominator: 6 },
      ] },

    { id: "q62", difficulty: "hard", slices: 8, showDecimal: true,
      toppings: [
          { toppingName: "pepperoni", numerator: 5, denominator: 8 },
          { toppingName: "olives", numerator: 1, denominator: 4 },
      ] },

    { id: "q63", difficulty: "hard", slices: 8, showDecimal: false,
      toppings: [
          { toppingName: "onions", numerator: 3, denominator: 8 },
          { toppingName: "basil", numerator: 1, denominator: 2 },
      ] },

    { id: "q64", difficulty: "hard", slices: 8, showDecimal: true,
      toppings: [
          { toppingName: "basil", numerator: 1, denominator: 8 },
          { toppingName: "olives", numerator: 1, denominator: 2 },
          { toppingName: "onions", numerator: 1, denominator: 4 },
      ] },

    { id: "q65", difficulty: "hard", slices: 9, showDecimal: false,
      toppings: [
          { toppingName: "pepperoni", numerator: 1, denominator: 3 },
          { toppingName: "olives", numerator: 2, denominator: 9 },
      ] },

    { id: "q66", difficulty: "hard", slices: 9, showDecimal: false,
      toppings: [
          { toppingName: "basil", numerator: 1, denominator: 3 },
          { toppingName: "onions", numerator: 4, denominator: 9 },
          { toppingName: "olives", numerator: 1, denominator: 9 },
      ] },

    { id: "q67", difficulty: "hard", slices: 10, showDecimal: true,
      toppings: [
          { toppingName: "pepperoni", numerator: 7, denominator: 10 },
          { toppingName: "onions", numerator: 1, denominator: 5 },
      ] },

    { id: "q68", difficulty: "hard", slices: 10, showDecimal: false,
      toppings: [
          { toppingName: "olives", numerator: 1, denominator: 2 },
          { toppingName: "basil", numerator: 2, denominator: 5 },
      ] },

    { id: "q69", difficulty: "hard", slices: 10, showDecimal: true,
      toppings: [
          { toppingName: "basil", numerator: 1, denominator: 2 },
          { toppingName: "olives", numerator: 1, denominator: 10 },
          { toppingName: "pepperoni", numerator: 1, denominator: 5 },
      ] },

    { id: "q70", difficulty: "hard", slices: 10, showDecimal: true,
      toppings: [
          { toppingName: "olives", numerator: 4, denominator: 5 },
          { toppingName: "onions", numerator: 1, denominator: 10 },
      ] },

    /* four-topping orders: every tray topping is used */

    { id: "q71", difficulty: "hard", slices: 8, showDecimal: true,
      toppings: [
          { toppingName: "pepperoni", numerator: 1, denominator: 4 },
          { toppingName: "olives", numerator: 1, denominator: 4 },
          { toppingName: "onions", numerator: 1, denominator: 8 },
          { toppingName: "basil", numerator: 3, denominator: 8 },
      ] },

    { id: "q72", difficulty: "hard", slices: 10, showDecimal: true,
      toppings: [
          { toppingName: "pepperoni", numerator: 2, denominator: 5 },
          { toppingName: "onions", numerator: 3, denominator: 10 },
          { toppingName: "olives", numerator: 1, denominator: 5 },
          { toppingName: "basil", numerator: 1, denominator: 10 },
      ] },

    { id: "q73", difficulty: "hard", slices: 6, showDecimal: false,
      toppings: [
          { toppingName: "olives", numerator: 1, denominator: 3 },
          { toppingName: "pepperoni", numerator: 1, denominator: 6 },
          { toppingName: "basil", numerator: 1, denominator: 3 },
          { toppingName: "onions", numerator: 1, denominator: 6 },
      ] },

    { id: "q74", difficulty: "hard", slices: 9, showDecimal: false,
      toppings: [
          { toppingName: "onions", numerator: 1, denominator: 3 },
          { toppingName: "pepperoni", numerator: 2, denominator: 9 },
          { toppingName: "olives", numerator: 1, denominator: 9 },
          { toppingName: "basil", numerator: 1, denominator: 3 },
      ] },

    { id: "q75", difficulty: "hard", slices: 10, showDecimal: false,
      toppings: [
          { toppingName: "basil", numerator: 1, denominator: 2 },
          { toppingName: "pepperoni", numerator: 1, denominator: 5 },
          { toppingName: "onions", numerator: 1, denominator: 10 },
          { toppingName: "olives", numerator: 1, denominator: 10 },
      ] },
];

/**
 *  makes a map data structure which stores keys and values
 *  EX:
 *  "q01" -> (maps to) Question object for q01
 *  "q02" -> Question object for q02
 *  etc
 *  goes through every single question in the above array and makes it into a pair
 *  then makes an array containing the [id, questionObject]
 *  this is so that you can search by id, instead of looping through possibly the entire array searching for it
 */
const questionsById = new Map(questions.map((question) => [question.id, question]));

// gets question by the id, expects a string id, returns a question object or undefined if id doesnt exist
export function getQuestionById(id: string): Question | undefined {
    //uses map to obtain value (which is question object), by key (which is id)
    return questionsById.get(id);
}

// same as last question but gets multiple questions instead (useful for saving missed questions)
// takes an array of ids, returns array of question objects
// doesnt return undefined if id is missing, just skips
export function getQuestionsByIds(ids: readonly string[]): Question[] {
    //for every id
    return ids.flatMap((id) => {
        //if id exists, question is equal to question object
        //otherwise undefined
        const question = questionsById.get(id);
        //if question exists, return the question, otherwise return []
        // we return an array since we are using a flatmap which will combine the arrays into one
        return question ? [question] : [];
    });
}

// gets all of the questions of a certain difficulty
// takes in Difficulty type, returns array of question objects
export function getQuestionsByDifficulty(difficulty: Difficulty): Question[] {
    // goes through every question and if difficulty matches, keep it in the questions array
    // if not it is excluded
    return questions.filter((question) => question.difficulty === difficulty);
}