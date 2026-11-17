import { GameDayController } from "../game/GameDayController";
import { GameFlow } from "../game/GameFlow";
import { dailyQuestionPicker, type QuestionResult } from "../game/questionSelector";
import { clearPizza } from "../pizza/PizzaController";
import { getQuestionsByDifficulty, type Question } from "./QuestionBank";
import type { Order } from "./CustomerModel";
import { PatienceMeter } from "./CustomerModel";
import { CustomerView } from "./CustomerView";

const LAST_DAY = 2;

let questions: Question[] = [];
let flow = new GameFlow([]);
let playerData: QuestionResult[] = [];
let recentScores: QuestionResult[] = [];
const missedIds: string[] = [];
let servedTotal = 0;
let facedTotal = 0;
let dayRecorded = false;
let controlsBound = false;

const view = new CustomerView();

const patience = new PatienceMeter(
    60,
    (time, percent) => view.updatePatienceBar(time, percent),
    () => customerLeft(),
);

const days = new GameDayController({
    areCustomersFinished: () => flow.isFinished(),
    prepareDay: (day) => beginDay(day),
});

export function getCurrentOrder(): Order | null {
    return flow.currentOrder();
}

export function canServe(): boolean {
    return flow.wait && !flow.isFinished();
}

export async function startCustomer(): Promise<void> {
    bindDayControls();
    await days.startDay();
}

export function getScore(): number {
    return flow.score;
}

export function getEarnings(): number {
    return flow.earnings;
}

export function getQuestionCount(): number {
    return questions.length;
}

export function markCorrect(): void {
    flow.serve(true);
}

export function markWrong(): void {
    flow.noteWrong();
}

export function advance(): void {
    const index = flow.round;
    view.mark(index, "done");
    flow.next();
    moveOn();
}

function demoQuestions(): Question[] {
    const list = [
        ...getQuestionsByDifficulty("medium").slice(0, 5),
        ...getQuestionsByDifficulty("hard").slice(0, 5),
    ];
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}

function beginDay(day: number): void {
    const cash = flow.earnings;
    questions = day === LAST_DAY
        ? demoQuestions()
        : dailyQuestionPicker(day, playerData, recentScores, missedIds).map((item) => item.question);
    flow = new GameFlow(questions);
    flow.earnings = cash;
    dayRecorded = false;

    view.showQueue(questions);
    view.showDay(day);
    view.setActive(0);
    view.showScore("");
    view.showNextDay(false);
    writeScore();
    writeCash();
    clearPizza();
    patience.reset();
    patience.start();
}

function rememberDay(): void {
    const missed = new Set(flow.getMissedQuestionsID().map((id) => String(id)));
    const results: QuestionResult[] = questions.map((question) => ({
        question,
        success: !missed.has(question.id),
    }));
    recentScores = playerData;
    playerData = results;
    for (const id of missed) {
        if (!missedIds.includes(id)) missedIds.push(id);
    }
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
        if (!dayRecorded) {
            servedTotal += flow.score;
            facedTotal += questions.length;
            dayRecorded = true;
        }
        const day = days.getCurrentDay();
        view.showScore(`Day ${day} over. You got ${flow.score} out of ${questions.length}.`);
        days.checkDayComplete();
        if (day < LAST_DAY) {
            view.showNextDay(true);
            return;
        }
        view.showNextDay(false);
        view.openWeek(`You served ${servedTotal} out of ${facedTotal}. Earnings: $${flow.earnings}.`);
        return;
    }

    view.setActive(flow.round);
    patience.reset();
    patience.start();
}

function bindDayControls(): void {
    if (controlsBound) return;
    controlsBound = true;

    const nextDay = document.getElementById("next-day");
    nextDay?.addEventListener("click", () => {
        view.showNextDay(false);
        rememberDay();
        void days.nextDay();
    });

    const menu = document.getElementById("week-menu");
    menu?.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

function writeScore(): void {
    const score = document.getElementById("score");
    if (score) score.textContent = `${flow.score} / ${questions.length}`;
}

function writeCash(): void {
    const cash = document.getElementById("cash");
    if (cash) cash.textContent = `${flow.earnings} `;
}

function closePopups(): void {
    for (const id of ["success", "fail"]) {
        const dialog = document.getElementById(id);
        if (dialog instanceof HTMLDialogElement && dialog.open) {
            dialog.close();
        }
    }
}
