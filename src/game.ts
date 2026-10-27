// main game: has shared state + game loop

export interface Order {
    numerator: number;
    denominator: number;
    showDecimal: boolean;
}