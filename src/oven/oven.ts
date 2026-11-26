import { OvenGameController } from "./OvenGameController";
import { OvenResultView } from "./OvenGameView";
import { OvenDialController } from "./OvenDialController";
import { OvenDialView } from "./OvenDialView";

// get HTML elements
const questionDisplay = document.getElementById("oven-question")!;
const scoreDisplay = document.getElementById("oven-score")!;
const dial = document.getElementById("oven-dial")!;
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

let dialView: OvenDialView;

const dialController = new OvenDialController({
    onValueChanged: () => {
        dialView.render();
    }
});

dialView = new OvenDialView(dial, dialController, selectedValue);

// create the game controller
const controller = new OvenGameController({

    // display the current question
    onQuestionChanged: (question) => {
        questionDisplay.textContent =
            `Bake the pizza for ${question.numerator}/${question.denominator} of a minute!`;

        // reset the dial for the new question
        dialController.resetNeedle();
        bakeButton.disabled = false;
    },

    // show feedback after answering
    onAnswerSubmitted: (result) => {
        dialController.lock();
        bakeButton.disabled = true;
        resultView.show(result);
    },

    // update the total score
    onScoreChanged: (score) => {
        scoreDisplay.textContent = score.toString();
    }
});

// submit the player's selected decimal
bakeButton.addEventListener("click", () => {
    const selectedDecimal = dialController.getSelectedDecimal();
    controller.submitAnswer(selectedDecimal);
});

// start the game
controller.startGame();
