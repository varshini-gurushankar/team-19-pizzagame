import { createPizza, setupToppings, toppingClonesArray } from "./PizzaView";
import { setupSliceSlider } from "./sliceSlider";

export function setupPizza(): void {
    const pizza = createPizza("pizza-container");

    if (pizza) {
        // toppings share the pizza's layer so they can be dragged onto it
        setupToppings(pizza.layer, pizza.pizzaSize);
        // draw this amount of slices
        setupSliceSlider((slices) => pizza.setSlices(slices));
    }
}

export function bindUndo(): void {
    const undoButton = document.getElementById("undo-button");

    if (!(undoButton instanceof HTMLButtonElement)) {
        throw new Error("Undo button not found");
    }

    undoButton.addEventListener("click", () => {
        const clonedTopping = toppingClonesArray.pop();
        if (!clonedTopping) return;

        const layer = clonedTopping.node.getLayer();
        clonedTopping.node.destroy();

        console.log("Deleted: " + clonedTopping.type);

        layer?.batchDraw();
    });
}
