import { currentOrder } from "./game";
import { validatePizza } from "./validate";
import { getSelectedSlices } from "./pizzaAssembly";
import { toppingClonesArray } from "./toppingsView"

//success and fail pop ups 
const successPopUp = document.getElementById("success") as HTMLDialogElement;
const failPopUp = document.getElementById("fail") as HTMLDialogElement;

//Continue buttons after popup 
const successContButton = document.getElementById("success-continue") as HTMLButtonElement;
const failContButton = document.getElementById("fail-continue") as HTMLButtonElement;


successContButton.addEventListener("click", () => successPopUp.close());
failContButton.addEventListener("click", () => failPopUp.close());

const serveButton = document.getElementById("serve-btn") as HTMLButtonElement;

serveButton?.addEventListener("click", () => {

    const order = currentOrder;

    const slices = getSelectedSlices(); 
    if (slices === null){
        return; 
    }

    const toppingsList: Record<string, number> = {};

    for (const topping of toppingClonesArray) {
        const name = topping.type;
        toppingsList[name] = (toppingsList[name] ?? 0) + 1;
    }

    const passValidator = validatePizza(order, slices, toppingsList);

    if (passValidator){
        //Show that the user got the answer correct 
        successPopUp.showModal();
    }
    else { 
        failPopUp.showModal();
    }
    
});
