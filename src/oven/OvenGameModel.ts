
// UI: use the numerator and denominator values to display question
export interface OvenQuestion {
    numerator: number;
    denominator: number;
}

export type OvenOutcome = "tooSoon" | "great" | "tooLate";

export interface OvenResult {
    outcome: OvenOutcome;
    points: number;
}

export class OvenGameModel {
    private currentQuestion: OvenQuestion;

    private score: number = 0;
    private answered: boolean = false;
    private lastResult: OvenResult | null = null;

    // accept answers within 0.05 of the correct decimal
    private readonly tolerance: number = 0.05;

    // possible fraction questions for the oven game
    private readonly questionPool: OvenQuestion[] = [
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 3 },
        { numerator: 1, denominator: 4 },
        { numerator: 1, denominator: 5 },
        { numerator: 1, denominator: 6 },
        { numerator: 2, denominator: 3 },
        { numerator: 2, denominator: 5 },
        { numerator: 3, denominator: 4 },
        { numerator: 3, denominator: 5 },
        { numerator: 3, denominator: 8 }
    ];

    constructor() {
        // generate a random question when the model is created
        this.currentQuestion = this.pickRandomQuestion();
    }

    // select a random question from the question pool
    // exclude parameter prevents the next question from being identical to the current one
    private pickRandomQuestion(exclude?: OvenQuestion): OvenQuestion {
        const availableQuestions = this.questionPool.filter(
            question =>
                !exclude || //if exclude contains a question, !exclude is false
                question.numerator !== exclude.numerator || //checks whether the question being examined has a different numerator from the excluded question
                question.denominator !== exclude.denominator
        );

        //math.floor rounds number down to the nearest integer
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);

        // ... copies the properties of the selected question into a new object
        // create copy so other code can use the returned question without directly 
        // modifying the original object stored in questionPool
        return { ...availableQuestions[randomIndex] };
    }

    // return the current question
    // if we return a reference to the original object, then
    // other code could accidentally modify the Model's question
    getCurrentQuestion(): OvenQuestion {
        return { ...this.currentQuestion };
    }

    // convert the current fraction to a decimal
    getCorrectDecimal(): number {
        return this.currentQuestion.numerator / this.currentQuestion.denominator;
    }

    // return the player's total score
    getScore(): number {
        return this.score;
    }

    // Check if the current question has been answered
    isAnswered(): boolean {
        return this.answered;
    }

    // Determine whether the player's answer is correct
    checkAnswer(selectedDecimal: number): OvenOutcome {
        //check if player input is valid
        if (
            !Number.isFinite(selectedDecimal) || //check if value is a not finite number (infinity/NaN)
            selectedDecimal < 0 || //check if value is negative
            selectedDecimal > 1 // check if value is greater than 1
        ) {
            throw new RangeError("Selected decimal must be between 0 and 1");
        }

        const correct = this.getCorrectDecimal();

        // value has to be within 0.05
        if (selectedDecimal < correct - this.tolerance) {
            return "tooSoon";
        }

        if (selectedDecimal > correct + this.tolerance) {
            return "tooLate";
        }

        return "great";
    }

    // submit the player's answer and award points
    submitAnswer(selectedDecimal: number): OvenResult {
        // prevent scoring the same question more than once
        if (this.answered && this.lastResult !== null) {
            return { ...this.lastResult };
        }

        const outcome = this.checkAnswer(selectedDecimal);
        const points = outcome === "great" ? 10 : 0;

        this.score += points;
        this.answered = true;

        this.lastResult = {
            outcome,
            points
        };

        // returns a copy of the result to whoever called submitAnswer()
        return { ...this.lastResult };
    }

    // generate a new question for the next round
    nextQuestion(): OvenQuestion {
        // select a random question different from the current one
        this.currentQuestion = this.pickRandomQuestion(this.currentQuestion);

        this.answered = false;
        this.lastResult = null;

        return this.getCurrentQuestion();
    }

    // restart the oven game
    restart(): void {
        this.score = 0;
        this.answered = false;
        this.lastResult = null;

        this.currentQuestion = this.pickRandomQuestion();
    }
}
