// main game: has shared state + game loop

export interface Order {
    
    slices: number;     

    //toppings as list of objects with name, and amount
    toppings: {
        toppingName: string; 
        numerator: number;
        denominator: number; 
    }[];

    showDecimal: boolean;
}