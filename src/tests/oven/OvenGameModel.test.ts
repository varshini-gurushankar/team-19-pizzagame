
import { describe, it, expect } from "vitest";
import { OvenGameModel } from "../../oven/OvenGameModel";

describe("OvenGameModel", () => {

    // Check that the game starts with a valid question and score of 0
    it("initializes with a valid question and score of 0", () => {
        const model = new OvenGameModel();
        const question = model.getCurrentQuestion();

        expect(model.getScore()).toBe(0);
        expect(question.numerator).toBeGreaterThan(0);
        expect(question.denominator).toBeGreaterThan(question.numerator);
        expect(model.isAnswered()).toBe(false);
    });

    // Check that the current fraction is converted to a decimal
    it("converts the fraction into a decimal", () => {
        const model = new OvenGameModel();
        const question = model.getCurrentQuestion();

        expect(model.getCorrectDecimal()).toBeCloseTo(
            question.numerator / question.denominator
        );
    });

    // Check that answers below the correct range are too soon
    it("detects an answer that is too soon", () => {
        const model = new OvenGameModel();
        const correct = model.getCorrectDecimal();

        expect(model.checkAnswer(correct - 0.1)).toBe("tooSoon");
    });

    // Check that the correct decimal is accepted
    it("detects a correct answer", () => {
        const model = new OvenGameModel();

        expect(
            model.checkAnswer(model.getCorrectDecimal())
        ).toBe("great");
    });

    // Check that answers above the correct range are too late
    it("detects an answer that is too late", () => {
        const model = new OvenGameModel();
        const correct = model.getCorrectDecimal();

        expect(model.checkAnswer(correct + 0.1)).toBe("tooLate");
    });

    // Check that a correct answer awards 10 points
    it("awards 10 points for a correct answer", () => {
        const model = new OvenGameModel();

        const result = model.submitAnswer(
            model.getCorrectDecimal()
        );

        expect(result.outcome).toBe("great");
        expect(result.points).toBe(10);
        expect(model.getScore()).toBe(10);
        expect(model.isAnswered()).toBe(true);
    });

    // Check that an incorrect answer awards 0 points
    it("awards 0 points for an incorrect answer", () => {
        const model = new OvenGameModel();

        const result = model.submitAnswer(0);

        expect(result.outcome).toBe("tooSoon");
        expect(result.points).toBe(0);
        expect(model.getScore()).toBe(0);
        expect(model.isAnswered()).toBe(true);
    });

    // Prevent the same question from being scored twice
    it("prevents duplicate scoring", () => {
        const model = new OvenGameModel();
        const correct = model.getCorrectDecimal();

        const firstResult = model.submitAnswer(correct);
        const secondResult = model.submitAnswer(correct);

        expect(firstResult.points).toBe(10);
        expect(secondResult).toEqual(firstResult);
        expect(model.getScore()).toBe(10);
    });

    // Check that nextQuestion() generates a different fraction
    it("generates a new question", () => {
        const model = new OvenGameModel();

        const oldQuestion = model.getCurrentQuestion();
        const newQuestion = model.nextQuestion();

        expect(newQuestion).not.toEqual(oldQuestion);
        expect(newQuestion.denominator).toBeGreaterThan(0);
        expect(newQuestion.numerator).toBeGreaterThan(0);
        expect(newQuestion.numerator).toBeLessThan(
            newQuestion.denominator
        );
    });

    // Reset answer state but preserve the score between questions
    it("resets the answer state while preserving score", () => {
        const model = new OvenGameModel();

        model.submitAnswer(model.getCorrectDecimal());

        expect(model.getScore()).toBe(10);
        expect(model.isAnswered()).toBe(true);

        model.nextQuestion();

        expect(model.isAnswered()).toBe(false);
        expect(model.getScore()).toBe(10);

        // Submit the correct answer for the new random question
        const result = model.submitAnswer(
            model.getCorrectDecimal()
        );

        expect(result.points).toBe(10);
        expect(model.getScore()).toBe(20);
    });

    // Check that restart() resets the oven game
    it("resets everything when restarting", () => {
        const model = new OvenGameModel();

        model.submitAnswer(model.getCorrectDecimal());
        model.nextQuestion();
        model.restart();

        const question = model.getCurrentQuestion();

        expect(model.getScore()).toBe(0);
        expect(model.isAnswered()).toBe(false);

        // Restart should generate a valid random question
        expect(question.numerator).toBeGreaterThan(0);
        expect(question.denominator).toBeGreaterThan(
            question.numerator
        );

        // Check that the new question can be answered
        const result = model.submitAnswer(
            model.getCorrectDecimal()
        );

        expect(result.points).toBe(10);
    });
});
