import { advance, canServe, getCurrentOrder, getDailyQuestionCount, markCorrect, startCustomer } from "../customer/CustomerController";
import { toppingNames } from "../customer/CustomerModel";
import { bindUndo, setupPizza } from "../pizza/PizzaController";
import { validatePizza } from "../pizza/PizzaModel";
import { toppingsAddRemove, toppingClonesArray, topping_sizes } from "../pizza/PizzaView";
import { getSelectedSlices } from "../pizza/sliceSlider";
import { questions } from "../customer/QuestionBank";
import { GameFlow } from "./GameFlow";

export function startGame(): void {
    document.addEventListener(toppingsAddRemove, updateToppingCounts);
    updateToppingCounts();
    startCustomer();
    setupPizza();
    bindServe();
    bindUndo();
}

const game = new GameFlow(questions);

function updateToppingCounts(): void {
    const counts = {
        pepperoni: 0,
        onions: 0,
        olives: 0,
        basil: 0,
    };

    for (const { type } of toppingClonesArray) {
        counts[type] += 1;
    }

    for (const name of toppingNames) {
        const count = document.getElementById(`topping-count-${name}`);
        if (!(count instanceof HTMLElement)) {
            throw new Error(`Topping count display for "${name}" not found`);
        }
        count.textContent = String(counts[name]);
    }
}

function restartResultAnimation(element: HTMLElement, passed: boolean, type: "score" | "cash"): void {
    const successClass = `${type}-pop-right`;
    const failureClass = `${type}-pop-wrong`;
    element.classList.remove(successClass, failureClass);
    void element.offsetWidth;
    element.classList.add(passed ? successClass : failureClass);
}

function updateScore(ans: boolean): void {
    const scoreDisplay = document.getElementById("score") as HTMLSpanElement;

    const nextScore = `${game.score} / ${getDailyQuestionCount()}`;

    scoreDisplay.textContent = nextScore;

    restartResultAnimation(scoreDisplay, ans, "score");
}

function updateCash(ans: boolean): void { 
    const cashDisplay = document.getElementById("cash") as HTMLSpanElement;

    const nextCash = `${game.earnings} `;

    cashDisplay.textContent = nextCash 

    restartResultAnimation(cashDisplay, ans, "cash");
}


function bindServe(): void {
    const successPopUp = document.getElementById("success") as HTMLDialogElement;
    const failPopUp = document.getElementById("fail") as HTMLDialogElement;
    const successContButton = document.getElementById("success-continue") as HTMLButtonElement;
    const failContButton = document.getElementById("fail-continue") as HTMLButtonElement;

    successContButton.addEventListener("click", () => {
        successPopUp.close();
        game.next();
        advance();
    });
    failContButton.addEventListener("click", () => {
        failPopUp.close();
        game.retry();
    });

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

        //console.log(pizzaSize)

        game.serve(passValidator);

        if (passValidator) {
            markCorrect();
            successPopUp.showModal();
        } else {
            failPopUp.showModal();
            //updateScore(); 
        }

        updateScore(passValidator);
        updateCash(passValidator); 
    });
}
