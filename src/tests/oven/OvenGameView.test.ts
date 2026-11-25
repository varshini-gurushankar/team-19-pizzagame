// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { OvenResultView } from "../../oven/OvenGameView";

describe("OvenResultView", () => {

    let container: HTMLElement;
    let onNextQuestion: () => void;
    let view: OvenResultView;

    beforeEach(() => {
        // create a container for the result popup
        document.body.innerHTML = `
            <div id="oven-result"></div>
        `;

        container = document.getElementById("oven-result")!;
        onNextQuestion = vi.fn();
        view = new OvenResultView(container, onNextQuestion);
    });

    // check that the popup starts hidden
    it("initializes with the result popup hidden", () => {
        expect(container.hidden).toBe(true);
        expect(container.innerHTML).toBe("");
    });

    // check that an early answer displays too soon
    it("displays too soon for an early answer", () => {
        view.show({
            outcome: "tooSoon",
            points: 0
        });

        expect(container.hidden).toBe(false);

        expect(
            container.querySelector("#oven-result-title")?.textContent
        ).toBe("Too Soon!");

        expect(
            container.querySelector("#oven-result-message")?.textContent
        ).toContain("No points");
    });

    // check that a correct answer displays great
    it("displays great and 10 points for a correct answer", () => {
        view.show({
            outcome: "great",
            points: 10
        });

        expect(container.hidden).toBe(false);

        expect(
            container.querySelector("#oven-result-title")?.textContent
        ).toBe("Great!");

        expect(
            container.querySelector("#oven-result-message")?.textContent
        ).toContain("10 points");
    });

    // check that a late answer displays too late
    it("displays too late for a late answer", () => {
        view.show({
            outcome: "tooLate",
            points: 0
        });

        expect(container.hidden).toBe(false);

        expect(
            container.querySelector("#oven-result-title")?.textContent
        ).toBe("Too Late!");

        expect(
            container.querySelector("#oven-result-message")?.textContent
        ).toContain("No points");
    });

    // check that hide removes the popup
    it("hides the popup when hide is called", () => {
        view.show({
            outcome: "great",
            points: 10
        });

        view.hide();

        expect(container.hidden).toBe(true);
        expect(container.innerHTML).toBe("");
    });

    // check that next question button calls the callback
    it("calls the next question function when clicked", () => {
        view.show({
            outcome: "great",
            points: 10
        });

        const button = container.querySelector(
            "#oven-next-question"
        ) as HTMLButtonElement;

        button.click();

        expect(onNextQuestion).toHaveBeenCalledTimes(1);
        expect(container.hidden).toBe(true);
    });
});
