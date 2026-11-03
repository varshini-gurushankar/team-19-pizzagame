// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { setupSliceSlider, getSelectedSlices } from "./sliceSlider";

// start value is default 1, string because of html input
function renderSlider(startValue = "1") {
    // makes HTML elements for the slider functionality
    document.body.innerHTML = `
        <input type="range" id="slice-slider" min="1" max="10" step="1" value="${startValue}">
        <span id="slice-count"></span>
        <span id="slice-word"></span>
    `;
    // makes objects of the html elements so that we can reference in test
    return {
        slider: document.getElementById("slice-slider") as HTMLInputElement,
        count: document.getElementById("slice-count") as HTMLElement,
        word: document.getElementById("slice-word") as HTMLElement,
    };
}

// simulates the player dragging the slider
function moveSlider(slider: HTMLInputElement, value: string): void {
    //sets slider value
    slider.value = value;
    // manually triggers input event, so setupSliceSlider has something to listen to
    slider.dispatchEvent(new Event("input"));
}

// after every test
afterEach(() => {
    // clear all HTML elements on the page to test clean reset environments everytime
    document.body.innerHTML = "";
    // specifically for the tests we do where we purposely create an error, so that it doesn't
    // affect other tests afterwards
    vi.restoreAllMocks();
});

// tests for setupSliceSlider()
describe("setupSliceSlider", () => {

    it("reports the starting value right away", () => {
        // creates slider, begins at 1
        renderSlider("1");
        // fake function tracking how many times called and what arguments received
        const onChange = vi.fn();

        setupSliceSlider(onChange);

        //onChange called once
        expect(onChange).toHaveBeenCalledTimes(1);
        //onChange argument was 1
        expect(onChange).toHaveBeenCalledWith(1);
    });

    it("shows the singular label for 1 slice", () => {
        //stores value of count and word if slider were to be at 1
        const { count, word } = renderSlider("1");

        setupSliceSlider(vi.fn());

        //slice count should be 1
        expect(count.textContent).toBe("1");
        //slice label should have SLICE instead of SLICES
        expect(word.textContent).toBe("SLICE");
    });

    it("updates the label and notifies the caller when the slider moves", () => {
        const { slider, count, word } = renderSlider("1");
        const onChange = vi.fn();
        setupSliceSlider(onChange);

        moveSlider(slider, "6");

        expect(count.textContent).toBe("6");
        expect(word.textContent).toBe("SLICES");
        expect(onChange).toHaveBeenLastCalledWith(6);
    });

    it("switches back to singular when moved back to 1", () => {
        const { slider, word } = renderSlider("4");
        setupSliceSlider(vi.fn());

        moveSlider(slider, "1");

        expect(word.textContent).toBe("SLICE");
    });

    it("handles the maximum value", () => {
        const { slider, count } = renderSlider("1");
        const onChange = vi.fn();
        setupSliceSlider(onChange);

        moveSlider(slider, "10");

        expect(count.textContent).toBe("10");
        expect(onChange).toHaveBeenLastCalledWith(10);
    });

    it("logs an error and never calls onChange when the slider is missing", () => {
        // no html elements
        document.body.innerHTML = "";
        // detects error without printing the error during the test
        const error = vi.spyOn(console, "error").mockImplementation(() => {});
        const onChange = vi.fn();

        setupSliceSlider(onChange);

        //did function log an error
        expect(error).toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
    });

    it("logs an error when only part of the label is missing", () => {
        //slice-count and slice-word are missing
        document.body.innerHTML = `<input type="range" id="slice-slider" value="3">`;
        const error = vi.spyOn(console, "error").mockImplementation(() => {});
        const onChange = vi.fn();

        setupSliceSlider(onChange);

        expect(error).toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
    });
});

//tests for getSelectedSlices()
describe("getSelectedSlices", () => {
    it("returns the current slider value as a number", () => {
        // slider set to 1
        const { slider } = renderSlider("1");
        // slider value set to "7"
        slider.value = "7";

        // successfully gets integer 7
        expect(getSelectedSlices()).toBe(7);
    });

    it("returns null when the slider isn't on the page", () => {
        //no html elements
        document.body.innerHTML = "";

        expect(getSelectedSlices()).toBeNull();
    });
});