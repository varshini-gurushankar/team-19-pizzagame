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
    getQuestionById,
    type Question,
    type Difficulty
} from "../../customer/QuestionBank"

import {
    dailyQuestionPicker,
    type QuestionResult
} from "../../game/questionSelector"

/** Basic Sanity Test */
describe("dailyQuestionPicker", () => {
    it("returns 10 unique questions and includes missed questions for review",
       () => {
        let recentScores: QuestionResult[] = [
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
        let playerData: QuestionResult[] = [
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
        let missedQuestions: Question["id"][] = [
            "q18", "q19", "q20", "q22", "q23",
            "q24", "q26", "q27", "q28", "q29",
        ];
        /**
         * Pass all four inputs to the function. Copy missedQuestions b/c the
         *  picker may remove review questions from the array.
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
        for(const id of missedQuestions.slice(0, 4))
            expect(resultIds).toContain(id);
    });
});

/** First Day */
describe("dailyQuestionPicker", () => {
    it("returns 10 easy questions for player's first day", () => {
        let recentScores: QuestionResult[]    = []; // empty
        let playerData: QuestionResult[]      = []; // empty
        let missedQuestions: Question["id"][] = []; // empty
        const result = dailyQuestionPicker(
            1,
            playerData,
            recentScores,
            [...missedQuestions]
        );
        expect(result).toHaveLength(10);
        const resultDifficulty = result.map(item => item.question.difficulty);
        /**
         * With these scores and day, the picker should select easy-level
         *  questions.
         */
        for(const difficulty of resultDifficulty.slice(0, 10))
            expect(difficulty).toContain("easy");
    });
});

/** No Ranking Up on Days Less Than or Equal to 2 */
describe("dailyQuestionPicker", () => {
    it("returns 10 unique questions but doesn't rank up when player is " +
    "not on a day past 2", () => {
        let recentScores: QuestionResult[] = []; // empty
        let playerData: QuestionResult[] = [
            { success: false, question: getQuestionById("q01")! },
            { success: false, question: getQuestionById("q02")! },
            { success: true, question: getQuestionById("q04")! },
            { success: true, question: getQuestionById("q06")! },
            { success: false, question: getQuestionById("q07")! },
            { success: true, question: getQuestionById("q10")! },
            { success: false, question: getQuestionById("q26")! },
            { success: false, question: getQuestionById("q27")! },
            { success: true, question: getQuestionById("q28")! },
            { success: false, question: getQuestionById("q29")! },
        ];
        let missedQuestions: Question["id"][] = [ "q35" ];
        const result = dailyQuestionPicker(
            2,
            playerData,
            recentScores,
            [...missedQuestions]
        );
        expect(result).toHaveLength(10);
        const resultDifficulty = result.map(item => item.question.difficulty);
        /**
         * With these scores and day, the picker should select easy-level
         *  questions.
         */
        for(const difficulty of resultDifficulty.slice(0, 10))
            expect(difficulty).toContain("easy");
    });
});

/** No Missed Questions */
describe("dailyQuestionPicker", () => {
    it("returns questions when there are no missed questions", () => {
        let recentScores: QuestionResult[] = [
            { success: true, question: getQuestionById("q03")! },
            { success: true, question: getQuestionById("q31")! },
            { success: true, question: getQuestionById("q12")! },
            { success: true, question: getQuestionById("q11")! },
            { success: true, question: getQuestionById("q21")! },
            { success: true, question: getQuestionById("q09")! },
            { success: true, question: getQuestionById("q05")! },
            { success: true, question: getQuestionById("q08")! },
            { success: false, question: getQuestionById("q13")! },
            { success: true, question: getQuestionById("q25")! },
        ];
        let playerData: QuestionResult[] = [
            { success: true, question: getQuestionById("q01")! },
            { success: true, question: getQuestionById("q02")! },
            { success: true, question: getQuestionById("q04")! },
            { success: true, question: getQuestionById("q06")! },
            { success: false, question: getQuestionById("q07")! },
            { success: true, question: getQuestionById("q10")! },
            { success: false, question: getQuestionById("q14")! },
            { success: true, question: getQuestionById("q15")! },
            { success: true, question: getQuestionById("q16")! },
            { success: false, question: getQuestionById("q17")! },
        ];
        let missedQuestions: Question["id"][] = [
            // empty
        ];
        const result = dailyQuestionPicker(
            3,
            playerData,
            recentScores,
            [...missedQuestions]
        );
        expect(result).toHaveLength(10);
        expect(missedQuestions).toHaveLength(0);

        const resultIds = result.map(item => item.question.id);
        expect(new Set(resultIds).size).toBe(resultIds.length);
    });
});

/** Less than 4 Missed Questions */
describe("dailyQuestionPicker", () => {
    it("returns questions and three of them are for review", () => {
        let recentScores: QuestionResult[] = [
            { success: true, question: getQuestionById("q03")! },
            { success: true, question: getQuestionById("q31")! },
            { success: true, question: getQuestionById("q12")! },
            { success: true, question: getQuestionById("q11")! },
            { success: true, question: getQuestionById("q21")! },
            { success: true, question: getQuestionById("q09")! },
            { success: true, question: getQuestionById("q05")! },
            { success: true, question: getQuestionById("q08")! },
            { success: false, question: getQuestionById("q13")! },
            { success: true, question: getQuestionById("q25")! },
        ];
        let playerData: QuestionResult[] = [
            { success: true, question: getQuestionById("q01")! },
            { success: true, question: getQuestionById("q02")! },
            { success: true, question: getQuestionById("q04")! },
            { success: true, question: getQuestionById("q06")! },
            { success: false, question: getQuestionById("q07")! },
            { success: true, question: getQuestionById("q10")! },
            { success: false, question: getQuestionById("q14")! },
            { success: true, question: getQuestionById("q15")! },
            { success: true, question: getQuestionById("q16")! },
            { success: false, question: getQuestionById("q17")! },
        ];
        let missedQuestions: Question["id"][] = [
            "q20", "q22", "q23",
        ];
        const result = dailyQuestionPicker(
            3,
            playerData,
            recentScores,
            [...missedQuestions]
        );
        expect(result).toHaveLength(10);
        const resultIds = result.map(item => item.question.id);
        expect(new Set(resultIds).size).toBe(resultIds.length);

        // With these scores, the picker should select 3 review questions.
        for(const id of missedQuestions.slice(0, 3))
            expect(resultIds).toContain(id);
    });
});

/** Test Rank Ups */
describe("dailyQuestionPicker", () => {
    it("easy-tier player ranks up to medium", () => {
        let recentScores: QuestionResult[] = [
            { success: true, question: getQuestionById("q03")! },
            { success: true, question: getQuestionById("q31")! },
            { success: true, question: getQuestionById("q12")! },
            { success: true, question: getQuestionById("q11")! },
            { success: true, question: getQuestionById("q21")! },
            { success: true, question: getQuestionById("q09")! },
            { success: true, question: getQuestionById("q05")! },
            { success: true, question: getQuestionById("q08")! },
            { success: true, question: getQuestionById("q13")! },
            { success: true, question: getQuestionById("q25")! },
        ];
        let playerData: QuestionResult[] = [
            { success: true, question: getQuestionById("q01")! },
            { success: true, question: getQuestionById("q02")! },
            { success: true, question: getQuestionById("q04")! },
            { success: true, question: getQuestionById("q06")! },
            { success: true, question: getQuestionById("q07")! },
            { success: true, question: getQuestionById("q10")! },
            { success: true, question: getQuestionById("q14")! },
            { success: true, question: getQuestionById("q15")! },
            { success: true, question: getQuestionById("q16")! },
            { success: true, question: getQuestionById("q17")! },
        ];
        let missedQuestions: Question["id"][] = []; // empty
        const result = dailyQuestionPicker(
            13,
            playerData,
            recentScores,
            [...missedQuestions]
        );
        expect(result).toHaveLength(10);
        const resultDifficulty = result.map(item => item.question.difficulty);
        // With these scores, the picker should select medium-level questions.
        for(const difficulty of missedQuestions.slice(0, 10))
            expect(difficulty).toContain("medium");
    });
});

/** Check if Player Score is below 0.5 */
describe("dailyQuestionPicker", () => {
    it("returns up to 5 missed questions for review if score below 0.5", () => {
        let recentScores: QuestionResult[] = [
            { success: false, question: getQuestionById("q03")! },
            { success: false, question: getQuestionById("q31")! },
            { success: false, question: getQuestionById("q12")! },
            { success: false, question: getQuestionById("q11")! },
            { success: false, question: getQuestionById("q21")! },
            { success: false, question: getQuestionById("q09")! },
            { success: true, question: getQuestionById("q05")! },
            { success: false, question: getQuestionById("q08")! },
            { success: false, question: getQuestionById("q13")! },
            { success: true, question: getQuestionById("q25")! },
        ];
        let playerData: QuestionResult[] = [
            { success: false, question: getQuestionById("q01")! },
            { success: false, question: getQuestionById("q02")! },
            { success: false, question: getQuestionById("q04")! },
            { success: true, question: getQuestionById("q06")! },
            { success: false, question: getQuestionById("q07")! },
            { success: true, question: getQuestionById("q10")! },
            { success: false, question: getQuestionById("q14")! },
            { success: false, question: getQuestionById("q15")! },
            { success: true, question: getQuestionById("q16")! },
            { success: false, question: getQuestionById("q17")! },
        ];
        let missedQuestions: Question["id"][] = [
            "q18", "q19", "q20", "q22", "q23",
            "q24", "q26", "q27", "q28", "q29",
        ];
        const result = dailyQuestionPicker(
            5,
            playerData,
            recentScores,
            [...missedQuestions]
        );
        expect(result).toHaveLength(10);

        const resultIds = result.map(item => item.question.id);
        expect(new Set(resultIds).size).toBe(resultIds.length);

        // With these scores, the picker should select 5 review questions.
        for(const id of missedQuestions.slice(0, 5))
            expect(resultIds).toContain(id);
    });
});
