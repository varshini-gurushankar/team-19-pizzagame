// stores the dials value from 0 - 1
export class OvenDialModel {
    private value: number;

    // starts dial at a intial safe value
    constructor(initialValue: number = 0){
        this.value = OvenDialModel.clamp(initialValue);
    }

    // keeps value from 0-1 and nothing below 0 or above 1
    private static clamp(value: number): number {
        if (!Number.isFinite(value)){
            return 0;
        }

        return Math.min(1, Math.max(0, value));
    }

    // turns the angle from radians to decimals, 0, 0.5 and 1
    static angleToDecimal(angleRad: number): number {
        if (!Number.isFinite(angleRad)){
            return 0;
        }

        // pointer should point within 0 and 1 and nothing below that or above that, 
        //cap the pointer dragging within these values
        if (angleRad < -Math.PI/2){
            return 0;
        }
        if (angleRad < 0){
            return 1;
        }
        return OvenDialModel.clamp(1 - angleRad/Math.PI);

    }

    // turns decimal into the needle rotation
    static decimalToDegrees(value: number): number {
        return (OvenDialModel.clamp(value) - 0.5) * 180;
    }

    // returns dial value
    getValue(): number {
        return this.value;
    }

    // saves the new value
    setValue(value: number): void {
        this.value = OvenDialModel.clamp(value);
    }

    // resets the value for the next question to 0
    reset(): void {
        this.value = 0;
    }
}