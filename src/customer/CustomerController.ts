import { GameDayController } from "../game/GameDayController";
import { GameFlow } from "../game/GameFlow";
import {
    dailyQuestionPicker,
    playerTier,
    type QuestionResult
} from "../game/questionSelector";
import { clearPizza } from "../pizza/PizzaController";
import { getQuestionsByDifficulty, type Question } from "./QuestionBank";
import type { Order } from "./CustomerModel";
import { PatienceMeter } from "./CustomerModel";
import { CustomerView } from "./CustomerView";

//const LAST_DAY = 2; // for testing
const LAST_DAY = 7;

let questions: Question[] = [];
let flow = new GameFlow([]);
let playerData: QuestionResult[] = [];
let recentScores: QuestionResult[] = [];
const missedIds: Question["id"][] = [];
let servedTotal = 0;
let facedTotal = 0;
let dayRecorded = false;
let controlsBound = false;

const view = new CustomerView();

/**
 * Initializes patience meter
 */
export let patienceSeconds = 30;
let patience = new PatienceMeter(
    patienceSeconds,
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

export function getScore(): number {
    return flow.score;
}

export function getEarnings(): number {
    return flow.earnings
}

export function pausePatience(): void {
    patience.stop();
}

export function resumePatience(): void {
    patience.start();
}

/*
function shuffleQuestions(list: Question[]): Question[] {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}

function demoQuestions(picked: readonly Question[], reviewIds: ReadonlySet<string>): Question[] {
    const kept = picked.filter((question) => reviewIds.has(question.id));
    const used = new Set(kept.map((question) => question.id));
    const open = 10 - kept.length;
    const mediumCount = Math.ceil(open / 2);
    const hardCount = open - mediumCount;
    const medium = getQuestionsByDifficulty("medium").filter((question) => !used.has(question.id)).slice(0, mediumCount);
    const hard = getQuestionsByDifficulty("hard").filter((question) => !used.has(question.id)).slice(0, hardCount);
    return shuffleQuestions([...kept, ...medium, ...hard]);
}
*/

function beginDay(day: number): void {
    const cash = flow.earnings;
    const reviewIds = new Set(missedIds);

    const picked = dailyQuestionPicker(
        day,
        playerData,
        recentScores,
        missedIds
    ).map((item) => item.question);
    questions = picked;

    flow = new GameFlow(questions);
    flow.earnings = cash;

    dayRecorded = false;

    patienceSeconds = playerTier === "hard" ? 60 : 30;
    patience = new PatienceMeter(
        patienceSeconds,
        (time, percent) => view.updatePatienceBar(time, percent),
        () => customerLeft(),
    );

    view.showQueue(questions);
    view.showDay(day);
    view.setActive(0);
    view.showActiveOrder(getCurrentOrder());
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
        view.showActiveOrder(null);
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
    view.showActiveOrder(getCurrentOrder());
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
