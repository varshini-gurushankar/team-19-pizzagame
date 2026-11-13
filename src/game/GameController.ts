import { currentOrder, startCustomer } from "../customer/CustomerController";
import { bindUndo, setupPizza } from "../pizza/PizzaController";
import { validatePizza } from "../pizza/PizzaModel";
import { toppingClonesArray, topping_sizes } from "../pizza/PizzaView";
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

        const placedToppings = toppingClonesArray.map(({ type, node }) => {
            const { x, y } = node.getAbsolutePosition();
            return { x, y, radius: topping_sizes[type] };
        });

        //Get the konva stage width
        const pizzaSize = toppingClonesArray[0]?.node.getStage()?.width() ?? 0;

        const passValidator = validatePizza(currentOrder, slices, {
            toppings: toppingsList,
            placedToppings,
            pizzaSize,
        });

        //console.log(pizzaSize)

        if (passValidator) {
            successPopUp.showModal();
        } else {
            failPopUp.showModal();
        }
    });
}
