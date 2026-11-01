import { Order } from "./game";
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
    console.log("Test: Serve Button Functioning ");

    //Testing the validator 
    const order: Order = {
        slices: 4,

        toppings: [
            {
                toppingName: "pepperoni",
                numerator: 1,
                denominator: 2
            },
            {
                toppingName: "olives",
                numerator: 1,
                denominator: 2
            }
        ],

        showDecimal: false
    };

    // const toppingsList: Record<string, number> = {
    //     pepperoni: 2, 
    //     mushroom: 2
    // }

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
