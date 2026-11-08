import { toppingClonesArray } from "./toppingsView"

const undoButton = document.getElementById("undo-button") as HTMLButtonElement;

if (!(undoButton instanceof HTMLButtonElement)) {
    throw new Error("Undo button not found");
}

undoButton.addEventListener("click", () => {
    const clonedTopping = toppingClonesArray.pop();
    if(!clonedTopping) {
        console.log("Empty.. " + toppingClonesArray.length);
        return;
    }
    const layer = clonedTopping.node.getLayer();
    clonedTopping.node.destroy();
    layer?.batchDraw();

    console.log("Deleted: " + clonedTopping.type + "\nNum of Toppings: " +
            toppingClonesArray.length);
});
