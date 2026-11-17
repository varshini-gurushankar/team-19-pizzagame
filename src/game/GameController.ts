import { advance, canServe, getCurrentOrder, getEarnings, getQuestionCount, getScore, markCorrect, markWrong, startCustomer } from "../customer/CustomerController";
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

function updateScore(ans: boolean): void {
    const scoreDisplay = document.getElementById("score") as HTMLParagraphElement;

    const nextScore = `${getScore()} / ${getQuestionCount()}`;

    scoreDisplay.textContent = nextScore;

    //Animations 
    scoreDisplay.classList.remove("score-pop-right", "score-pop-wrong");
    if (ans){
        scoreDisplay.classList.add("score-pop-right");
    }
    else{
        scoreDisplay.classList.add("score-pop-wrong");
    }
    
}

function updateCash(ans: boolean): void { 
    const cashDisplay = document.getElementById("cash") as HTMLParagraphElement;

    const nextCash = `${getEarnings()} `;

    cashDisplay.textContent = nextCash 

    cashDisplay.classList.remove("cash-pop-right", "cash-pop-wrong");
    if (ans) {
        cashDisplay.classList.add("cash-pop-right");
    } else {
        cashDisplay.classList.add("cash-pop-wrong");
    }
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

    /*
        const passValidator = validatePizza(order, slices, toppingsList);
    */
        const placedToppings = toppingClonesArray.map(({ type, node }) => {
            const { x, y } = node.getAbsolutePosition();
            return { x, y, radius: topping_sizes[type] };
        });

        //Get the konva stage width
        const pizzaSize = toppingClonesArray[0]?.node.getStage()?.width() ?? 0;

        const passValidator = validatePizza(order, slices, {
            toppings: toppingsList,
            placedToppings,
            pizzaSize,
        });

        if (passValidator) {
            markCorrect();
            successPopUp.showModal();
        } else {
            markWrong();
            failPopUp.showModal();
        }

        updateScore(passValidator);
        updateCash(passValidator); 
    });
}
