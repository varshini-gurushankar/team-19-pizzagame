// main game: has shared state + game loop
import { PatienceMeter } from "./PatienceMeter";
import { GameInterface } from "./GameInterface";
import { formatOrder } from "./formatOrder";
import {type Order, orders} from "./orders";

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


// shown under the patience meter; Serve checks this same order
export const currentOrder: Order = orders[0];

const orderDetails = document.getElementById("order-details");

if (orderDetails) {
    orderDetails.textContent = formatOrder(currentOrder);
}