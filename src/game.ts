// main game: has shared state + game loop
import { PatienceMeter } from "./PatienceMeter";
import { GameInterface } from "./GameInterface";
import { formatOrder } from "./formatOrder";

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

// shown under the patience meter; Serve checks this same order
export const currentOrder: Order = {
    slices: 4,
    toppings: [
        { toppingName: "pepperoni", numerator: 1, denominator: 2 },
        { toppingName: "olives", numerator: 1, denominator: 2 },
    ],
        showDecimal: true,
};

const orderDetails = document.getElementById("order-details");

if (orderDetails) {
    orderDetails.textContent = formatOrder(currentOrder);
}