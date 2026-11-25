
import { describe, it, expect, vi } from "vitest";
import { OvenGameController } from "../../oven/OvenGameController";

describe("OvenGameController", () => {

    // create fake functions for the ui
    function createDependencies() {
        return {
            onQuestionChanged: vi.fn(),
            onAnswerSubmitted: vi.fn(),
            onScoreChanged: vi.fn()
        };
    }

    // get the correct decimal for the randomly generated question
    function getCorrectDecimal(controller: OvenGameController): number {
        const question = controller.getCurrentQuestion();

        return question.numerator / question.denominator;
    }

    // check that the game starts with a valid question and score of 0
    it("initializes with a valid question and score of 0", () => {
        const controller = new OvenGameController();
        const question = controller.getCurrentQuestion();

        expect(question.numerator).toBeGreaterThan(0);
        expect(question.denominator).toBeGreaterThan(
            question.numerator
        );
        expect(controller.getScore()).toBe(0);
        expect(controller.isAnswered()).toBe(false);
    });

    // check that starting the game notifies the ui
    it("displays the starting question and score", () => {
        const dependencies = createDependencies();
        const controller = new OvenGameController(dependencies);

        controller.startGame();

        expect(dependencies.onQuestionChanged).toHaveBeenCalledWith(
            controller.getCurrentQuestion()
        );
        expect(dependencies.onScoreChanged).toHaveBeenCalledWith(0);
        expect(dependencies.onAnswerSubmitted).not.toHaveBeenCalled();
    });

    // check that submitting a correct answer awards points
    it("submits a correct answer and updates the UI", () => {
        const dependencies = createDependencies();
        const controller = new OvenGameController(dependencies);

        const correct = getCorrectDecimal(controller);
        const result = controller.submitAnswer(correct);

        expect(result.outcome).toBe("great");
        expect(result.points).toBe(10);
        expect(controller.getScore()).toBe(10);
        expect(controller.isAnswered()).toBe(true);

        expect(dependencies.onAnswerSubmitted).toHaveBeenCalledWith(result);
        expect(dependencies.onScoreChanged).toHaveBeenCalledWith(10);
    });

    // check that an incorrect answer does not award points
    it("submits an incorrect answer and awards 0 points", () => {
        const dependencies = createDependencies();
        const controller = new OvenGameController(dependencies);

        const result = controller.submitAnswer(0);

        expect(result.outcome).toBe("tooSoon");
        expect(result.points).toBe(0);
        expect(controller.getScore()).toBe(0);

        expect(dependencies.onAnswerSubmitted).toHaveBeenCalledWith(result);
        expect(dependencies.onScoreChanged).toHaveBeenCalledWith(0);
    });

    // check that an answer that is too late is handled correctly
    it("detects an answer that is too late", () => {
        const dependencies = createDependencies();
        const controller = new OvenGameController(dependencies);

        const result = controller.submitAnswer(1);

        expect(result.outcome).toBe("tooLate");
        expect(result.points).toBe(0);
        expect(dependencies.onAnswerSubmitted).toHaveBeenCalledWith(result);
    });

    // prevent the same question from being submitted twice
    it("prevents duplicate submissions and UI updates", () => {
        const dependencies = createDependencies();
        const controller = new OvenGameController(dependencies);

        const correct = getCorrectDecimal(controller);

        const firstResult = controller.submitAnswer(correct);
        const secondResult = controller.submitAnswer(0);

        expect(firstResult.points).toBe(10);
        expect(secondResult).toEqual(firstResult);
        expect(controller.getScore()).toBe(10);
        expect(dependencies.onAnswerSubmitted).toHaveBeenCalledTimes(1);
        expect(dependencies.onScoreChanged).toHaveBeenCalledTimes(1);
    });

    // prevent moving to the next question before answering
    it("prevents skipping an unanswered question", () => {
        const dependencies = createDependencies();
        const controller = new OvenGameController(dependencies);

        const originalQuestion = controller.getCurrentQuestion();
        const result = controller.nextQuestion();

        expect(result).toBeNull();
        expect(controller.getCurrentQuestion()).toEqual(originalQuestion);
        expect(dependencies.onQuestionChanged).not.toHaveBeenCalled();
    });

    // check that answering allows the player to move on
    it("generates a new question after answering", () => {
        const dependencies = createDependencies();
        const controller = new OvenGameController(dependencies);

        const oldQuestion = controller.getCurrentQuestion();

        controller.submitAnswer(getCorrectDecimal(controller));
        const newQuestion = controller.nextQuestion();

        expect(newQuestion).not.toBeNull();
        expect(newQuestion).not.toEqual(oldQuestion);
        expect(controller.isAnswered()).toBe(false);
        expect(dependencies.onQuestionChanged).toHaveBeenCalledWith(
            newQuestion
        );
    });

    // check that the score is preserved between questions
    it("preserves the score across multiple questions", () => {
        const dependencies = createDependencies();
        const controller = new OvenGameController(dependencies);

        controller.submitAnswer(getCorrectDecimal(controller));
        expect(controller.getScore()).toBe(10);

        const question = controller.nextQuestion();

        expect(question).not.toBeNull();
        expect(controller.getScore()).toBe(10);

        // submit the correct answer for the new random question
        controller.submitAnswer(getCorrectDecimal(controller));

        expect(controller.getScore()).toBe(20);
        expect(dependencies.onScoreChanged).toHaveBeenCalledWith(20);
    });

    // check that restarting resets the game and notifies the ui
    it("restarts the game and resets the score", () => {
        const dependencies = createDependencies();
        const controller = new OvenGameController(dependencies);

        controller.submitAnswer(getCorrectDecimal(controller));
        controller.nextQuestion();

        controller.restart();

        const question = controller.getCurrentQuestion();

        expect(controller.getScore()).toBe(0);
        expect(controller.isAnswered()).toBe(false);

        // restart should generate a valid random question
        expect(question.numerator).toBeGreaterThan(0);
        expect(question.denominator).toBeGreaterThan(
            question.numerator
        );

        expect(dependencies.onQuestionChanged).toHaveBeenLastCalledWith(
            question
        );
        expect(dependencies.onScoreChanged).toHaveBeenLastCalledWith(0);
    });

    // check that the controller works without ui callbacks
    it("works without optional UI callbacks", () => {
        const controller = new OvenGameController();

        controller.startGame();

        const result = controller.submitAnswer(
            getCorrectDecimal(controller)
        );

        expect(result.points).toBe(10);
        expect(controller.nextQuestion()).not.toBeNull();

        controller.restart();
        expect(controller.getScore()).toBe(0);
    });

    // check that invalid decimals cannot be submitted
    it("rejects invalid decimal values", () => {
        const dependencies = createDependencies();
        const controller = new OvenGameController(dependencies);

        expect(() => controller.submitAnswer(-0.1)).toThrow(RangeError);
        expect(() => controller.submitAnswer(1.5)).toThrow(RangeError);

        expect(controller.getScore()).toBe(0);
        expect(controller.isAnswered()).toBe(false);
        expect(dependencies.onAnswerSubmitted).not.toHaveBeenCalled();
    });
});
