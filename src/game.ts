// main game: has shared state + game loop
import { PatienceMeter } from "./PatienceMeter";
import { GameInterface } from "./GameInterface";

const gameUI = new GameInterface();

const patience = new PatienceMeter(
  60,
  (time, percent) => gameUI.updatePatienceBar(time, percent),
  () => {
    console.log("Customer ran out of patience!");
    // Handle customer leaving
  }
);

// when customer arrives:
patience.start();

// when player serves pizza:
// patience.stop();

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

export interface OrderList { 
    getOrders():Order[]; 
}

export interface TopingList { 
    getTopingList(): Record<string, number> 
}