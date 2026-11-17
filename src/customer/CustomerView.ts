import { GameInterface } from "../game/GameInterface";
import type { Order } from "./CustomerModel";
import { formatOrder } from "./formatOrder";

export class CustomerView {
    private gameUI = new GameInterface();
    private rows: HTMLElement[] = [];
    private activeIndex = -1;

    showQueue(orders: readonly Order[]): void {
        const list = document.getElementById("customer-list");
        if (!list) return;

        list.replaceChildren();
        this.rows = orders.map((order, index) => {
            const row = document.createElement("article");
            row.className = "customer";
            row.innerHTML = `
                <div class="patience-container">
                    <div class="patience-label">
                        <span>Customer ${index + 1}</span>
                        <span class="patience-time">60s</span>
                    </div>
                    <div class="patience-bar">
                        <div class="patience-fill"></div>
                    </div>
                </div>
                <p class="order-details"></p>
            `;
            const details = row.querySelector(".order-details");
            if (details) details.textContent = formatOrder(order);
            list.append(row);
            return row;
        });
    }

    setActive(index: number): void {
        this.activeIndex = index;
        this.rows.forEach((row, i) => {
            row.classList.toggle("active", i === index);
        });
        this.rows[index]?.scrollIntoView({ block: "nearest" });
    }

    clearActive(): void {
        this.activeIndex = -1;
        for (const row of this.rows) row.classList.remove("active");
    }

    mark(index: number, status: "done" | "left"): void {
        const row = this.rows[index];
        if (!row) return;
        row.classList.remove("active");
        row.classList.add(status);
        const label = row.querySelector(".patience-label span");
        if (label) {
            label.textContent = status === "left"
                ? `Customer ${index + 1} left`
                : `Customer ${index + 1} served`;
        }
    }

    updatePatienceBar(time: number, percent: number): void {
        const row = this.rows[this.activeIndex];
        if (!row) return;
        const fill = row.querySelector(".patience-fill");
        const timeText = row.querySelector(".patience-time");
        if (!(fill instanceof HTMLElement) || !(timeText instanceof HTMLElement)) return;
        this.gameUI.updatePatienceBar(time, percent, fill, timeText);
    }

    showDay(day: number): void {
        const label = document.getElementById("current-day");
        if (label) label.textContent = `Day ${day}`;
    }

    showScore(text: string): void {
        const score = document.getElementById("day-score");
        if (score) score.textContent = text;
    }

    showNextDay(show: boolean): void {
        const button = document.getElementById("next-day");
        if (button instanceof HTMLButtonElement) button.hidden = !show;
    }

    openWeek(text: string): void {
        const summary = document.getElementById("week-summary");
        if (summary) summary.textContent = text;
        const dialog = document.getElementById("week");
        if (dialog instanceof HTMLDialogElement) dialog.showModal();
    }
}
