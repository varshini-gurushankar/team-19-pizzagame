
import { describe, it, expect } from "vitest";
import { GameDayModel } from "../../game/GameDayModel";

describe("GameDayModel", () => {

    // verifies that a new game starts on Day 1, has "ready" status, and has 0 completed days
    it("starts on Day 1 with ready status", () => {
        const model = new GameDayModel();

        expect(model.getCurrentDay()).toBe(1);
        expect(model.getStatus()).toBe("ready");
        expect(model.getDaysFinished()).toBe(0);
    });

    // checks that startDay() returns true and changes the status to "active"
    it("starts a day successfully", () => {
        const model = new GameDayModel();

        expect(model.startDay()).toBe(true);
        expect(model.getStatus()).toBe("active");
    });

    // checks that calling startDay() again while the day is active returns false
    it("prevents starting the same day twice", () => {
        const model = new GameDayModel();

        model.startDay();

        expect(model.startDay()).toBe(false);
        expect(model.getStatus()).toBe("active");
    });

    // checks endDay() returns false if the day hasn't started without changing the status or completed-day count
    it("prevents ending a day that has not started", () => {
        const model = new GameDayModel();

        expect(model.endDay()).toBe(false);
        expect(model.getDaysFinished()).toBe(0);
        expect(model.getStatus()).toBe("ready");
    });

    // checks that endDay() changes the status to "complete" and increases daysFinished by 1
    it("ends a day and increments daysFinished", () => {
        const model = new GameDayModel();

        model.startDay();

        expect(model.endDay()).toBe(true);
        expect(model.getStatus()).toBe("complete");
        expect(model.getDaysFinished()).toBe(1);
    });

    // checks that calling endDay() twice doesn't count the same day as completed twice
    it("prevents ending the same day twice", () => {
        const model = new GameDayModel();

        model.startDay();
        model.endDay();

        expect(model.endDay()).toBe(false);
        expect(model.getDaysFinished()).toBe(1);
    });

    // checks that nextDay() returns false if the current day is still active
    it("prevents advancing before the day is complete", () => {
        const model = new GameDayModel();

        model.startDay();

        expect(model.nextDay()).toBe(false);
        expect(model.getCurrentDay()).toBe(1);
    });

    // checks that nextDay() increments the day number, resets the status to "ready", and preserves daysFinished
    it("advances to the next day and resets the status", () => {
        const model = new GameDayModel();

        model.startDay();
        model.endDay();

        expect(model.nextDay()).toBe(true);
        expect(model.getCurrentDay()).toBe(2);
        expect(model.getStatus()).toBe("ready");
        expect(model.getDaysFinished()).toBe(1);
    });

    // checks that the game can progress from Day 1 to Day 3 while correctly tracking completed days
    it("tracks progression across multiple days", () => {
        const model = new GameDayModel();

        // day 1
        model.startDay();
        model.endDay();
        model.nextDay();

        // day 2
        model.startDay();
        model.endDay();
        model.nextDay();

        // day 3
        expect(model.getCurrentDay()).toBe(3);
        expect(model.getDaysFinished()).toBe(2);
        expect(model.getStatus()).toBe("ready");
    });
});
