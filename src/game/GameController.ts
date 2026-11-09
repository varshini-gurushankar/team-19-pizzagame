import { currentOrder, startCustomer } from "../customer/CustomerController";
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

    successContButton.addEventListener("click", () => successPopUp.close());
    failContButton.addEventListener("click", () => failPopUp.close());

    const serveButton = document.getElementById("serve-btn") as HTMLButtonElement;

    serveButton?.addEventListener("click", () => {
        const slices = getSelectedSlices();
        if (slices === null) {
            return;
        }

        const toppingsList: Record<string, number> = {};

        for (const topping of toppingClonesArray) {
            const name = topping.type;
            toppingsList[name] = (toppingsList[name] ?? 0) + 1;
        }

        const passValidator = validatePizza(currentOrder, slices, toppingsList);

        if (passValidator) {
            successPopUp.showModal();
        } else {
            failPopUp.showModal();
        }
    });
}
