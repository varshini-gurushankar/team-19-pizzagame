// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { CustomerView } from "../../customer/CustomerView";
import { orders } from "../../customer/CustomerModel";

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
