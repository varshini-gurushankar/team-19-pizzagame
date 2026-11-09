import { orders, PatienceMeter } from "./CustomerModel";
import { CustomerView } from "./CustomerView";

// shown under the patience meter; Serve checks this same order
export const currentOrder = orders[0];

export function startCustomer(): void {
    const view = new CustomerView();

    const patience = new PatienceMeter(
        60,
        (time, percent) => view.updatePatienceBar(time, percent),
        () => {
            console.log("Customer ran out of patience!");
        }
    );

    patience.start();
    view.showOrder(currentOrder);
}
