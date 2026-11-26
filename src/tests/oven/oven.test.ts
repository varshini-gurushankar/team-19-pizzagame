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

            <div id="oven-dial"></div>

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


    });