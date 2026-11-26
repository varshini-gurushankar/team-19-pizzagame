import { OvenDialModel } from "./OvenDialModel";

// calls abck so view can change when theres a new number
export interface OvenDialDependencies{
    onValueChanged?: (value: number) => void;
}

// handles needle input and lock bw view and model
export class OvenDialController{
    private model: OvenDialModel;
    private dependencies: OvenDialDependencies;

    // returns true after submitting, locks the needle
    private locked: boolean = false;

    constructor(dependencies: OvenDialDependencies = {}){
        this.model = new OvenDialModel();
        this.dependencies = dependencies;
    }


    // returns the decimal the player chooses
    getSelectedDecimal(): number {
        return this.model.getValue();
    }

    // stops needle from moving
    isLocked(): boolean {
        return this.locked;
    }

    lock(): void {
        this.locked = true;
    }

    // unlocks needle and allows it to move
    unlock(): void {
        this.locked = false;
    }

    // updates needle unless its locked
    setValue(value: number): void {
        if (this.locked) {
            return;
        }

        this.model.setValue(value);
        this.dependencies.onValueChanged?.(this.model.getValue());
    }

    // moves the needle using the drag angle
    setAngle(angleRad: number): void {
        this.setValue(OvenDialModel.angleToDecimal(angleRad));
    }

    // returns chosen value when its locked, returns null if its alr submitted

    submit(): number | null{
        if(this.locked){
            return null;
        }
        this.lock();
        return this.model.getValue();
    }



    // resets needle by unlocking it and moving it to 0 for new question
    resetNeedle(): void {
        this.unlock();
        this.model.reset();
        this.dependencies.onValueChanged?.(this.model.getValue());
    }
}