// @vitest-environment jsdom
import {beforeEach, describe, expect, it} from "vitest";
import { CustomerView } from "../../customer/CustomerView";
import { orders, type Order } from "../../customer/CustomerModel";


// added an example of a basic one topping pizza to reuse for both tests
const pepperoniHalf: Order = {
    slices: 4,
    toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 2}],
    showDecimal: false,

};


describe("CustomerView.showActiveOrder", () =>{

    // when the customer order is shown, its order panel would be in the UI
    // this shud display as the proper formatted text
    it("puts the current customers order into the order panel", () => {
        document.body.innerHTML = `<div id="active-order"></div>`;
        const view = new CustomerView();

        view.showActiveOrder(pepperoniHalf);

        expect(document.getElementById("active-order")?.textContent).toBe(
            "Cut into 4 slices. 1/2 pepperoni."
        );
    
    });

    describe("CustomerView queue labels", () => {
        let view: CustomerView;

        beforeEach(() => {
            document.body.innerHTML = '<div id="customer-list"></div>';
            view = new CustomerView();
        });

        it("labels the active customer and only the next customer", () => {
            view.showQueue(orders.slice(0, 3));
            document.querySelectorAll<HTMLElement>(".customer").forEach((row) => {
                row.scrollIntoView = () => {};
            });

            view.setActive(0);

            const labels = Array.from(document.querySelectorAll(".customer-status"))
                .map((label) => label.textContent);
            expect(labels).toEqual([
                "NOW SERVING: Customer 1",
                "UP NEXT: Customer 2",
                "Customer 3",
            ]);
        });

        it("keeps a served label when the next customer becomes active", () => {
            view.showQueue(orders.slice(0, 3));
            document.querySelectorAll<HTMLElement>(".customer").forEach((row) => {
                row.scrollIntoView = () => {};
            });

            view.setActive(0);
            view.mark(0, "done");
            view.setActive(1);

            const labels = Array.from(document.querySelectorAll(".customer-status"))
                .map((label) => label.textContent);
            expect(labels).toEqual([
                "Customer 1 served",
                "NOW SERVING: Customer 2",
                "UP NEXT: Customer 3",
            ]);
        });
    });

    // when there isnt an active order, the panel should be empty 
    it("clears the panel when theres no active order", () => {
        document.body.innerHTML = `<div id="active-order"></div>`;
        const view = new CustomerView();

        //trying to see if it actually does get cleared
        view.showActiveOrder(pepperoniHalf);
        view.showActiveOrder(null);

        expect(document.getElementById("active-order")?.textContent).toBe(
            ""
        );
    
    });

});

