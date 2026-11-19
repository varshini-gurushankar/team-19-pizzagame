// @vitest-environment jsdom
import {describe, expect, it} from "vitest";
import { CustomerView } from "../../customer/CustomerView";
import type {Order} from "../../customer/CustomerModel";


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

