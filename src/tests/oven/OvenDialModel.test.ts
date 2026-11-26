import { describe, it, expect } from "vitest";
import { OvenDialModel } from "../../oven/OvenDialModel";

describe("OvenDialModel", () => {
    //checks starting value
    it("starts at 0", () => {
        const model = new OvenDialModel();
        expect(model.getValue()).toBe(0);
    });

    // checks values above 1 and below 0
    it("keeps the value bw 0 and 1", ()=> {
        const model = new OvenDialModel();
        model.setValue(5);
        expect(model.getValue()).toBe(1);
        model.setValue(-5);
        expect(model.getValue()).toBe(0);
    });

    // checks if needle angle is being converted to decimal
    it("properly checks that the needle angle is converted to a decimal", () =>{
        expect(OvenDialModel.angleToDecimal(Math.PI/2)).toBe(0.5);
    });

    // checks if needle resets value back to 0
    it("resets value back to 0", () => {
        const model = new OvenDialModel();
            model.setValue(0.8);
            model.reset();
        expect(model.getValue()).toBe(0);
    });

    // checks if right end is 0 and left end is 1
    it("converts left and right ends of dial", () =>{
        expect(OvenDialModel.angleToDecimal(Math.PI)).toBe(0);
        expect(OvenDialModel.angleToDecimal(0)).toBe(1);
    });

});