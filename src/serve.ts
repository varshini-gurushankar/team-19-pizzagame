import { Order, OrderList, TopingList } from "./game";
import { validatePizza } from "./validate";
import { getSelectedSlices } from "./pizzaAssembly";


const serveButton = document.getElementById("serve-btn");

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
                toppingName: "mushroom",
                numerator: 1,
                denominator: 2
            }
        ],

        showDecimal: false
    };

    const toppingsList: Record<string, number> = {
        pepperoni: 2, 
        mushroom: 2
    }

    const slices = getSelectedSlices(); 
    if (slices === null){
        return; 
    }

    const passValidator = validatePizza(order, slices, toppingsList);

    if (passValidator){
        alert("Success")
    }
    else { 
        alert("False")
    }
    
});
