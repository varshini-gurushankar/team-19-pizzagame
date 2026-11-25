export const SHELF_SIZE = 8;

// "5 lb", "0.4 lb", "3/5 lb", and "2 1/3 lb" all become a number.
export function parseWeight(label: string): number {
    const text = label.trim().toLowerCase().replace(/\s*lb\s*$/, "").trim();

    const mixed = text.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (mixed) {
        return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
    }

    const fraction = text.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (fraction) {
        return Number(fraction[1]) / Number(fraction[2]);
    }

    const value = Number(text);
    if (!Number.isFinite(value)) {
        throw new Error(`Cannot read weight: ${label}`);
    }
    return value;
}

// Slots whose weight is not where it would sit once the shelf is sorted.
export function wrongIndexes(weights: number[]): number[] {
    const sorted = [...weights].sort((a, b) => a - b);
    return weights.flatMap((weight, index) => weight === sorted[index] ? [] : [index]);
}

// Index of the left box in the first pair that is not strictly increasing. -1 if none.
export function firstMistake(weights: number[]): number {
    for (let i = 1; i < weights.length; i++) {
        if (!(weights[i] > weights[i - 1])) {
            return i - 1;
        }
    }
    return -1;
}

// True only for a full shelf where each box is strictly lighter than the next.
export function isLightestToHeaviest(weights: number[]): boolean {
    if (weights.length !== SHELF_SIZE) {
        return false;
    }
    for (let i = 1; i < weights.length; i++) {
        if (!(weights[i] > weights[i - 1])) {
            return false;
        }
    }
    return true;
}

function emptyShelf(): (number | null)[] {
    return Array(SHELF_SIZE).fill(null);
}

export class StockModel {
    private slots: (number | null)[] = emptyShelf();

    place(slot: number, weight: number): boolean {
        if (!Number.isInteger(slot) || slot < 0 || slot >= SHELF_SIZE) {
            return false;
        }
        if (this.slots[slot] !== null) {
            return false;
        }
        this.slots[slot] = weight;
        return true;
    }

    clear(slot: number): void {
        if (slot >= 0 && slot < SHELF_SIZE) {
            this.slots[slot] = null;
        }
    }

    filledCount(): number {
        return this.slots.filter((weight) => weight !== null).length;
    }

    isFull(): boolean {
        return this.filledCount() === SHELF_SIZE;
    }

    isSorted(): boolean {
        if (!this.isFull()) {
            return false;
        }
        return isLightestToHeaviest(this.slots as number[]);
    }

    reset(): void {
        this.slots = emptyShelf();
    }
}
