import {
    OvenGameModel,
    type OvenQuestion,
    type OvenResult
} from "./OvenGameModel";

// functions provided by the UI
export interface OvenGameDependencies {
    // display the current fraction question
    onQuestionChanged?: (question: OvenQuestion) => void;

    // display the result after submitting an answer
    onAnswerSubmitted?: (result: OvenResult) => void;

    // update the displayed score
    onScoreChanged?: (score: number) => void;
}

export class OvenGameController {
    private model: OvenGameModel;
    private dependencies: OvenGameDependencies;

    constructor(dependencies: OvenGameDependencies = {}) {
        this.model = new OvenGameModel();
        this.dependencies = dependencies;
    }

    // get the current fraction question
    getCurrentQuestion(): OvenQuestion {
        return this.model.getCurrentQuestion();
    }

    // get the player's total score
    getScore(): number {
        return this.model.getScore();
    }

    // check whether the current question has been answered
    isAnswered(): boolean {
        return this.model.isAnswered();
    }

    // start the oven game
    startGame(): void {
        this.dependencies.onQuestionChanged?.(
            this.model.getCurrentQuestion()
        );

        this.dependencies.onScoreChanged?.(
            this.model.getScore()
        );
    }

    // submit the decimal selected by the player
    submitAnswer(selectedDecimal: number): OvenResult {
        const alreadyAnswered = this.model.isAnswered();

        // Let the model check the answer and calculate points
        const result = this.model.submitAnswer(selectedDecimal);

        // Only notify the UI for the first submission
        if (!alreadyAnswered) {
            this.dependencies.onAnswerSubmitted?.(result);

            this.dependencies.onScoreChanged?.(
                this.model.getScore()
            );
        }

        return result;
    }

    // move to the next fraction question
    nextQuestion(): OvenQuestion | null {
        // prevent skipping a question before answering
        if (!this.model.isAnswered()) {
            return null;
        }

        const question = this.model.nextQuestion();

        // Notify the UI to display the new question
        this.dependencies.onQuestionChanged?.(question);

        return question;
    }

    // restart the oven game
    restart(): void {
        this.model.restart();

        // update the UI with the reset question and score
        this.dependencies.onQuestionChanged?.(
            this.model.getCurrentQuestion()
        );

        this.dependencies.onScoreChanged?.(
            this.model.getScore()
        );
    }
}
