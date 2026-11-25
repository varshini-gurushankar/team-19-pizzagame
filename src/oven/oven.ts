import { OvenGameController } from "./OvenGameController";
import { OvenResultView } from "./OvenGameView";

// get HTML elements
const questionDisplay = document.getElementById("oven-question")!;
const scoreDisplay = document.getElementById("oven-score")!;
const dial = document.getElementById("oven-dial") as HTMLInputElement;
const selectedValue = document.getElementById("selected-value")!;
const bakeButton = document.getElementById("bake-button") as HTMLButtonElement;
const resultContainer = document.getElementById("oven-result")!;

// display the current day from the main game
const dayDisplay = document.getElementById("oven-day");

const currentDay = localStorage.getItem("pizzaGameDay") ?? "1";

if (dayDisplay) {
    dayDisplay.textContent = currentDay;
}

// create the result view
const resultView = new OvenResultView(
    resultContainer,
    () => {
        controller.nextQuestion();
    }
);

// create the game controller
const controller = new OvenGameController({

    // display the current question
    onQuestionChanged: (question) => {
        questionDisplay.textContent =
            `Bake the pizza for ${question.numerator}/${question.denominator} of a minute!`;

        // reset the dial for the new question
        dial.value = "0";
        selectedValue.textContent = "0.00";
        bakeButton.disabled = false;
    },

    // show feedback after answering
    onAnswerSubmitted: (result) => {
        bakeButton.disabled = true;
        resultView.show(result);
    },

    // update the total score
    onScoreChanged: (score) => {
        scoreDisplay.textContent = score.toString();
    }
});

// update the decimal when the slider moves
dial.addEventListener("input", () => {
    selectedValue.textContent = Number(dial.value).toFixed(2);
});

// submit the player's selected decimal
bakeButton.addEventListener("click", () => {
    const selectedDecimal = Number(dial.value);
    controller.submitAnswer(selectedDecimal);
});

// start the game
controller.startGame();
