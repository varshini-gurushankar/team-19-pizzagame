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

//list of weights that the boxes can have, some numbers are equivalent like 7/5
// and 1.4 but later logic will make sure they are not in the same round
export const WEIGHT_LABELS: readonly string[] = [
    "0.3 lb", "1/3 lb", "0.4 lb", "1/2 lb", "3/5 lb", "2/3 lb", "0.75 lb",
    "1 lb", "1 1/4 lb", "1.4 lb", "7/5 lb", "1.8 lb", "2 lb", "2.25 lb",
    "9/4 lb", "2 1/3 lb", "2.6 lb", "8/3 lb", "3 lb", "3.25 lb", "3 1/2 lb",
    "3 3/4 lb", "4 lb", "4.2 lb", "4 1/2 lb", "5 lb", "5.5 lb", "6 lb",
    "7 1/4 lb", "9 lb",
];

// rounds weights so weights that are equivalent count as the same weight
function weightKey(label: string): number {
    return Math.round(parseWeight(label) * 1_000_000);
}

export function pickWeights(
    //8 weight labels
    count: number = SHELF_SIZE,
    //Math.random instead of Math.random() so that pickWeights can call it whenever
    //random numbers are needed allowing us, so that testing is easier
    random: () => number = Math.random,
    //will automatically use weight_lables unless given a specific different collection
    // this is useful for testing later
    bank: readonly string[] = WEIGHT_LABELS
): string[] {
    // make a copy of the WEIGHT_LABELS array, so that we can shuffle this
    // this keeps the original array in tact, just in case other parts need the original order
    const shuffled = [...bank];
    // fisher yates shuffle so every possible order is equally likely
    // basically start at the end for i and then pick a random parter j, then swap
    // then do the same for i - 1, until beginning of list is reached
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // array of weight labels that we select
    const picked: string[] = [];
    // set will help us identify if two numbers are equivalent
    const usedValues = new Set<number>();
    for (const label of shuffled) {
        //until we have 8 weight labels
        if (picked.length === count) {
            break;
        }
        //round the label
        const key = weightKey(label);
        //if we don't have that unique value yet
        if (!usedValues.has(key)) {
            usedValues.add(key);
            picked.push(label);
        }
    }

    //if we weren't able to get 8 unique valued labels
    if (picked.length < count) {
        throw new Error(`Only ${picked.length} distinct weights available, need ${count}`);
    }
    return picked;
}
