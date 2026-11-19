
import { describe, it, expect, vi } from "vitest";
import { GameDayController } from "../../game/GameDayController";

describe("GameDayController", () => {

    // create fake functions for other game systems
    function createDependencies() {
        const state = { customersFinished: false };

        const dependencies = {
            areCustomersFinished: vi.fn(
                () => state.customersFinished
            ),

            prepareDay: vi.fn(
                async (_day: number): Promise<void> => {}
            ),

            onDayStarted: vi.fn((_day: number) => {}),

            onDayEnded: vi.fn((_day: number) => {})
        };

        return { dependencies, state };
    }

    // checks that the controller starts on Day 1 with 0 completed days
    it("initializes on Day 1", () => {
        const { dependencies } = createDependencies();
        const controller = new GameDayController(dependencies);

        expect(controller.getCurrentDay()).toBe(1);
        expect(controller.getDaysFinished()).toBe(0);
    });

    // checks that startDay() successfully prepares Day 1 and calls onDayStarted() to notify the UI
    it("prepares the day and notifies the UI when starting", async () => {
        const { dependencies } = createDependencies();
        const controller = new GameDayController(dependencies);

        const result = await controller.startDay();

        expect(result).toBe(true);
        //check what argument has passed
        expect(dependencies.prepareDay).toHaveBeenCalledWith(1);
        //check how many times it was called
        expect(dependencies.prepareDay).toHaveBeenCalledTimes(1);
        expect(dependencies.onDayStarted).toHaveBeenCalledWith(1);
    });

    // checks calling startDay() again after the day has started returns false and doesn't repeat preparation or UI notification
    it("prevents starting the same day twice", async () => {
        const { dependencies } = createDependencies();
        const controller = new GameDayController(dependencies);

        await controller.startDay();
        const result = await controller.startDay();

        expect(result).toBe(false);
        expect(dependencies.prepareDay).toHaveBeenCalledTimes(1);
        expect(dependencies.onDayStarted).toHaveBeenCalledTimes(1);
    });

    // checks that if startDay() is called twice while the first call is still 
    // preparing customers and questions, the second call is rejected
    it("prevents duplicate starts while preparation is pending", async () => {
        let finishPreparation: (() => void) | undefined;

        // create a pending Promise that we can manually resolve later
        const prepareDay = vi.fn(() => new Promise<void>((resolve) => {
            finishPreparation = () => resolve();
        }));

        const controller = new GameDayController({
            areCustomersFinished: () => false,
            prepareDay
        });

        // start the day twice before preparation finishes
        const firstStart = controller.startDay();
        const secondStart = controller.startDay();

        expect(await secondStart).toBe(false);
        expect(prepareDay).toHaveBeenCalledTimes(1);

        finishPreparation?.();

        expect(await firstStart).toBe(true);
    });

    // checks checkDayComplete() returns false when customers are still waiting and doesn't end the day or notify the UI
    it("does not end the day while customers remain", async () => {
        const { dependencies } = createDependencies();
        const controller = new GameDayController(dependencies);

        await controller.startDay();

        const result = controller.checkDayComplete();

        expect(result).toBe(false);
        expect(controller.getDaysFinished()).toBe(0);
        expect(dependencies.onDayEnded).not.toHaveBeenCalled();
    });

    // checks that the day ends successfully, increments daysFinished, and notifies the UI when all customers are done
    it("ends the day when all customers are finished", async () => {
        const { dependencies, state } = createDependencies();
        const controller = new GameDayController(dependencies);

        await controller.startDay();

        state.customersFinished = true;

        const result = controller.checkDayComplete();

        expect(result).toBe(true);
        expect(controller.getDaysFinished()).toBe(1);
        expect(dependencies.onDayEnded).toHaveBeenCalledWith(1);
    });

    // checks calling checkDayComplete() twice doesn't count the same day twice or send duplicate UI notifications
    it("prevents ending the same day twice", async () => {
        const { dependencies, state } = createDependencies();
        const controller = new GameDayController(dependencies);

        await controller.startDay();
        state.customersFinished = true;

        controller.checkDayComplete();
        const result = controller.checkDayComplete();

        expect(result).toBe(false);
        expect(controller.getDaysFinished()).toBe(1);
        expect(dependencies.onDayEnded).toHaveBeenCalledTimes(1);
    });

    // checks that nextDay() returns false if the current day hasn't finished, keeping the day number unchanged
    it("prevents advancing before the day is complete", async () => {
        const { dependencies } = createDependencies();
        const controller = new GameDayController(dependencies);

        await controller.startDay();

        const result = await controller.nextDay();

        expect(result).toBe(false);
        expect(controller.getCurrentDay()).toBe(1);
        expect(dependencies.prepareDay).toHaveBeenCalledTimes(1);
    });

    // verifies that completing Day 1 and calling nextDay() advances to Day 2, 
    // prepares new gameplay, notifies the UI, and preserves the completed-day count
    it("advances to Day 2 and prepares new gameplay", async () => {
        const { dependencies, state } = createDependencies();
        const controller = new GameDayController(dependencies);

        // Complete Day 1
        await controller.startDay();
        state.customersFinished = true;
        controller.checkDayComplete();

        // Start Day 2
        const result = await controller.nextDay();

        expect(result).toBe(true);
        expect(controller.getCurrentDay()).toBe(2);
        expect(controller.getDaysFinished()).toBe(1);

        expect(dependencies.prepareDay).toHaveBeenCalledWith(2);
        expect(dependencies.onDayStarted).toHaveBeenCalledWith(2);
        expect(dependencies.prepareDay).toHaveBeenCalledTimes(2);
    });

    // checks that if prepareDay() throws an error, the controller can retry
    //  starting the same day successfully without prematurely notifying the UI
    it("allows retrying if day preparation fails", async () => {
        let shouldFail = true;

        const prepareDay = vi.fn(async () => {
            if (shouldFail) {
                shouldFail = false;
                throw new Error("Preparation failed");
            }
        });

        const onDayStarted = vi.fn();

        const controller = new GameDayController({
            areCustomersFinished: () => false,
            prepareDay,
            onDayStarted
        });

        await expect(controller.startDay()).rejects.toThrow(
            "Preparation failed"
        );

        expect(onDayStarted).not.toHaveBeenCalled();
        expect(controller.getCurrentDay()).toBe(1);

        // try starting again
        const result = await controller.startDay();

        expect(result).toBe(true);
        expect(prepareDay).toHaveBeenCalledTimes(2);
        expect(onDayStarted).toHaveBeenCalledWith(1);
    });

    // checks that the controller can start, end, and advance days even when onDayStarted and onDayEnded aren't provided
    it("works without optional UI callbacks", async () => {
        const controller = new GameDayController({
            areCustomersFinished: () => true,
            prepareDay: () => {}
        });

        expect(await controller.startDay()).toBe(true);
        expect(controller.checkDayComplete()).toBe(true);
        expect(await controller.nextDay()).toBe(true);
        expect(controller.getCurrentDay()).toBe(2);
    });
});
