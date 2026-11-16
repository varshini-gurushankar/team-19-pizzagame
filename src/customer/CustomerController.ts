import { GameFlow } from "../game/GameFlow";
import { clearPizza } from "../pizza/PizzaController";
import { dailyQuestionPicker } from "../questionSelector";
import type { Order } from "./CustomerModel";
import { PatienceMeter } from "./CustomerModel";
import { CustomerView } from "./CustomerView";

const questions = dailyQuestionPicker(1, [], [], []).map((item) => item.question);
const flow = new GameFlow(questions);
const view = new CustomerView();

const patience = new PatienceMeter(
    60,
    (time, percent) => view.updatePatienceBar(time, percent),
    () => customerLeft(),
);

export function getCurrentOrder(): Order | null {
    return flow.currentOrder();
}

export function canServe(): boolean {
    return flow.wait && !flow.isFinished();
}

export function startCustomer(): void {
    view.showQueue(questions);
    view.setActive(flow.round);
    patience.start();
}

export function markCorrect(): void {
    flow.serve(true);
}

export function advance(): void {
    const index = flow.round;
    view.mark(index, "done");
    flow.next();
    moveOn();
}

function customerLeft(): void {
    if (flow.isFinished() || !flow.wait) return;

    const index = flow.round;
    flow.timeUp();
    view.mark(index, "left");
    closePopups();
    flow.next();
    moveOn();
}

function moveOn(): void {
    clearPizza();

    if (flow.isFinished()) {
        patience.stop();
        view.clearActive();
        view.showScore(`Day over. You got ${flow.score} out of ${questions.length}.`);
        return;
    }

    view.setActive(flow.round);
    patience.reset();
    patience.start();
}

function closePopups(): void {
    for (const id of ["success", "fail"]) {
        const dialog = document.getElementById(id);
        if (dialog instanceof HTMLDialogElement && dialog.open) {
            dialog.close();
        }
    }
}
