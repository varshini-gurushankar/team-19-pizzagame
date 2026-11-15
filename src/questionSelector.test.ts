/**
 * == GOAL ==
 *  (1) select questions for each day,
 *  (2) prioritize prviously missed questions,
 *  (3) avoid repeated questions within a day,
 *  (4) and mix new questions with review questions
 */

import {
    describe,
    expect,
    it
} from "vitest";

import {
    getQuestionsByDifficulty,
    getQuestionById
} from "./customer/QuestionBank.ts"

import { dailyQuestionPicker } from "./questionSelector.ts"

import type { QuestionResult } from "./questionSelector.ts"

/**
 * Arrays for testing
 */

// the scores from day d-2
export let recentScores: QuestionResult[] = [
    { success: true, question: getQuestionById("q03")! },
    { success: true, question: getQuestionById("q31")! },
    { success: false, question: getQuestionById("q12")! },
    { success: true, question: getQuestionById("q11")! },
    { success: true, question: getQuestionById("q21")! },
    { success: false, question: getQuestionById("q09")! },
    { success: true, question: getQuestionById("q05")! },
    { success: true, question: getQuestionById("q08")! },
    { success: false, question: getQuestionById("q13")! },
    { success: true, question: getQuestionById("q25")! },
];

// immediately from the previous day, since dailyQuestionPicker() is called at
// the beginning of each day
export let playerData: QuestionResult[] = [
    { success: true, question: getQuestionById("q01")! },
    { success: false, question: getQuestionById("q02")! },
    { success: true, question: getQuestionById("q04")! },
    { success: true, question: getQuestionById("q06")! },
    { success: false, question: getQuestionById("q07")! },
    { success: true, question: getQuestionById("q10")! },
    { success: false, question: getQuestionById("q14")! },
    { success: true, question: getQuestionById("q15")! },
    { success: true, question: getQuestionById("q16")! },
    { success: false, question: getQuestionById("q17")! },
];

export let missedQuestions: QuestionResult[] = [
    { success: false, question: getQuestionById("q18")! },
    { success: false, question: getQuestionById("q19")! },
    { success: false, question: getQuestionById("q20")! },
    { success: false, question: getQuestionById("q22")! },
    { success: false, question: getQuestionById("q23")! },
    { success: false, question: getQuestionById("q24")! },
    { success: false, question: getQuestionById("q26")! },
    { success: false, question: getQuestionById("q27")! },
    { success: false, question: getQuestionById("q28")! },
    { success: false, question: getQuestionById("q29")! },
];

describe("dailyQuestionPicker", () => {
    it("returns 10 unique questions and includes missed questions for review",
       () => {
           /**
            * Pass all four inputs to the function. Copy missedQuestions
            *  b/c the picker may remove review questions from the array.
            */
           const result = dailyQuestionPicker(
               10,
               playerData,
               recentScores,
               [...missedQuestions]
           );

           expect(result).toHaveLength(10);

           const resultIds = result.map(item => item.question.id);
           expect(new Set(resultIds).size).toBe(resultIds.length);

           // With these scores, the picker should select 4 review questions.
           for(const missed of missedQuestions.slice(0, 4)) {
               expect(resultIds).toContain(missed.question.id);
           }
  });
});
