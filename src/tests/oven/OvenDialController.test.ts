import { describe, it, expect } from "vitest";
import { OvenDialController } from "../../oven/OvenDialController";


describe("OvenDialController", () => {
    //checks if a second submit is blocked
    it("only lets you submit the answer once", () => {
        const controller = new OvenDialController();
            controller.setValue(0.3);
        expect(controller.submit()).toBe(0.3);
        expect(controller.submit()).toBe(null);
    });

    // checks if unlocks and resets needle for next question
    it("resets needle for next question", () => {
        const controller = new OvenDialController();
            controller.setValue(0.7);
            controller.resetNeedle();
        expect(controller.submit()).toBe(0);
       
    });

    // checks if setValue moves the needle
    it("moves needle to accurate value", () => {
        const controller = new OvenDialController();
            controller.setValue(0.25);
            
        expect(controller.getSelectedDecimal()).toBe(0.25);
       
    });


    // cheks if needle is locked after submission
    it("does not move the needle after submission", () => {
        const controller = new OvenDialController();
            controller.setValue(0.4);
            controller.submit();
            controller.setValue(0.9);

        expect(controller.getSelectedDecimal()).toBe(0.4);
       
    });

    // checks if an angle moves the needle
    it("does not move the needle using angle algorithm", () => {
        const controller = new OvenDialController();
            controller.setAngle(Math.PI/2);
           
        expect(controller.submit()).toBe(0.5);
       
    });





});

