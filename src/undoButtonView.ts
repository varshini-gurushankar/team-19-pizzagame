import { toppingClonesArray } from "./toppingsView"

const undoButton = document.getElementById("undo-button") as HTMLButtonElement;

if (!(undoButton instanceof HTMLButtonElement)) {
    throw new Error("Undo button not found");
}

undoButton.addEventListener("click", () => {
    const clonedTopping = toppingClonesArray.pop();
    if(!clonedTopping) return;

    const layer = clonedTopping.node.getLayer();
    clonedTopping.node.destroy();

    console.log("Deleted: " + clonedTopping.type);

    layer?.batchDraw();
});
