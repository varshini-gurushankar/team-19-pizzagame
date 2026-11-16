import { advance, canServe, getCurrentOrder, markCorrect, startCustomer } from "../customer/CustomerController";
import { bindUndo, setupPizza } from "../pizza/PizzaController";
import { validatePizza } from "../pizza/PizzaModel";
import { toppingClonesArray } from "../pizza/PizzaView";
import { getSelectedSlices } from "../pizza/sliceSlider";

export function startGame(): void {
    startCustomer();
    setupPizza();
    bindServe();
    bindUndo();
}

function bindServe(): void {
    const successPopUp = document.getElementById("success") as HTMLDialogElement;
    const failPopUp = document.getElementById("fail") as HTMLDialogElement;
    const successContButton = document.getElementById("success-continue") as HTMLButtonElement;
    const failContButton = document.getElementById("fail-continue") as HTMLButtonElement;

    successContButton.addEventListener("click", () => {
        successPopUp.close();
        advance();
    });
    failContButton.addEventListener("click", () => failPopUp.close());

    const serveButton = document.getElementById("serve-btn") as HTMLButtonElement;

    serveButton?.addEventListener("click", () => {
        if (!canServe()) return;

        const order = getCurrentOrder();
        if (!order) return;

        const slices = getSelectedSlices();
        if (slices === null) {
            return;
        }

        const toppingsList: Record<string, number> = {};

        for (const topping of toppingClonesArray) {
            const name = topping.type;
            toppingsList[name] = (toppingsList[name] ?? 0) + 1;
        }

        const passValidator = validatePizza(order, slices, toppingsList);

        if (passValidator) {
            markCorrect();
            successPopUp.showModal();
        } else {
            failPopUp.showModal();
        }
    });
}
