import { GameInterface } from "../game/GameInterface";
import type { Order } from "./CustomerModel";
import { formatOrder } from "./formatOrder";

export class CustomerView {
    private gameUI = new GameInterface();

    updatePatienceBar(time: number, percent: number): void {
        this.gameUI.updatePatienceBar(time, percent);
    }

    showOrder(order: Order): void {
        const orderDetails = document.getElementById("order-details");
        if (orderDetails) {
            orderDetails.textContent = formatOrder(order);
        }
    }
}
