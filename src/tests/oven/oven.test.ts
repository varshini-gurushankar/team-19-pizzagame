// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Oven Timer Page", () => {

    beforeEach(() => {
        vi.resetModules();

        // create the html elements needed by oven.ts
        document.body.innerHTML = `
            <h2 id="oven-question"></h2>
            <span id="oven-score">0</span>
            <span id="oven-day">1</span>

            <input
                id="oven-dial"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value="0"
            >

            <span id="selected-value">0.00</span>

            <button id="bake-button">
                Start Baking
            </button>

            <div id="oven-result" hidden></div>
        `;

        localStorage.clear();
    });

    // check that the page displays a question and starting score
    it("displays the starting question and score", async () => {
        await import("../../oven/oven");

        const question = document.getElementById("oven-question")!;
        const score = document.getElementById("oven-score")!;

        expect(question.textContent).toContain("Bake the pizza for");
        expect(score.textContent).toBe("0");
    });

    // check that moving the slider updates the selected decimal
    it("updates the displayed decimal when the slider moves", async () => {
        await import("../../oven/oven");

        const dial = document.getElementById(
            "oven-dial"
        ) as HTMLInputElement;

        const selectedValue = document.getElementById(
            "selected-value"
        )!;

        dial.value = "0.25";
        dial.dispatchEvent(new Event("input"));

        expect(selectedValue.textContent).toBe("0.25");
    });

    // check that a correct answer updates the score
    it("submits a correct answer and displays feedback", async () => {
        await import("../../oven/oven");

        const questionText = document.getElementById(
            "oven-question"
        )!.textContent!;

        // get the generated fraction from the displayed question
        const match = questionText.match(/(\d+)\/(\d+)/);

        expect(match).not.toBeNull();

        const numerator = Number(match![1]);
        const denominator = Number(match![2]);
        const correctDecimal = numerator / denominator;

        const dial = document.getElementById(
            "oven-dial"
        ) as HTMLInputElement;

        // set the slider close to the correct decimal
        dial.value = correctDecimal.toFixed(2);

        const bakeButton = document.getElementById(
            "bake-button"
        ) as HTMLButtonElement;

        bakeButton.click();

        expect(
            document.getElementById("oven-score")?.textContent
        ).toBe("10");

        expect(
            document.getElementById("oven-result-title")?.textContent
        ).toBe("Great!");
    });

    // check that the next question button advances the game
    it("generates a new question after submitting", async () => {
        await import("../../oven/oven");

        const questionDisplay = document.getElementById(
            "oven-question"
        )!;

        const oldQuestion = questionDisplay.textContent!;

        const match = oldQuestion.match(/(\d+)\/(\d+)/)!;
        const correctDecimal = Number(match[1]) / Number(match[2]);

        const dial = document.getElementById(
            "oven-dial"
        ) as HTMLInputElement;

        dial.value = correctDecimal.toFixed(2);

        const bakeButton = document.getElementById(
            "bake-button"
        ) as HTMLButtonElement;

        bakeButton.click();

        const nextButton = document.getElementById(
            "oven-next-question"
        ) as HTMLButtonElement;

        nextButton.click();

        expect(questionDisplay.textContent).not.toBe(oldQuestion);
        expect(dial.value).toBe("0");
        expect(bakeButton.disabled).toBe(false);
    });
});
