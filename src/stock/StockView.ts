export function allBoxes(): HTMLElement[] {
    return [...document.querySelectorAll("#box-pile .box, #shelf .box")];
}

export function moveToPile(box: HTMLElement): void {
    document.getElementById("box-pile")?.append(box);
}

export function moveToSlot(box: HTMLElement, slot: HTMLElement): void {
    slot.append(box);
}

export function setBoxesLeft(count: number): void {
    const node = document.getElementById("boxes-left");
    if (node) {
        node.textContent = String(count);
    }
}

export function setCheckEnabled(enabled: boolean): void {
    const button = document.getElementById("check-order-button");
    if (button instanceof HTMLButtonElement) {
        button.disabled = !enabled;
    }
}

export function setBanner(text: string): void {
    const banner = document.getElementById("instruction-banner");
    if (banner) {
        banner.textContent = text;
    }
}

export function setPatience(remainingMs: number, totalMs: number): void {
    const fill = document.getElementById("driver-fill");
    const time = document.getElementById("driver-time");
    if (fill) {
        const ratio = Math.max(0, Math.min(1, remainingMs / totalMs));
        fill.style.width = `${ratio * 100}%`;
    }
    if (time) {
        time.textContent = formatTime(remainingMs);
    }
}

export function markWrong(indexes: number[]): void {
    const slots = [...document.querySelectorAll("#shelf .slot")];
    slots.forEach((slot, index) => {
        slot.querySelector(".box")?.classList.toggle("wrong", indexes.includes(index));
    });
}

export function clearWrong(): void {
    for (const box of allBoxes()) {
        box.classList.remove("wrong");
    }
}

export function setOrderHint(text: string, wrong: boolean): void {
    const hint = document.getElementById("order-hint");
    if (!hint) {
        return;
    }
    hint.textContent = text;
    hint.classList.toggle("wrong", wrong);
    hint.hidden = text === "";
}

export function markSelected(box: HTMLElement | null): void {
    for (const candidate of allBoxes()) {
        candidate.classList.toggle("selected", candidate === box);
    }
}

function formatTime(remainingMs: number): string {
    const total = Math.max(0, Math.ceil(remainingMs / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    if (minutes === 0) {
        return `${seconds}s`;
    }
    return `${minutes}m${seconds.toString().padStart(2, "0")}s`;
}

export function renderBoxes(labels: readonly string[]): void {
    //remove existing boxes
    for (const box of allBoxes()) {
        box.remove();
    }
    //gets box-pile HTML element
    const pile = document.getElementById("box-pile");
    //for every label given
    for (const label of labels) {
        //makes div element
        const box = document.createElement("div");
        //gives div the class box
        box.className = "box";
        //gives box appropiate weight label
        box.textContent = label;
        //adds the div element with class box and appropaite label to the box pile div
        // if it is null then do nothing
        pile?.append(box);
    }
}

// fills an end-screen row with small boxes, or a message if there are none
export function renderEndBoxes(containerId: string, labels: readonly string[]): void {
    //finds correct container
    const container = document.getElementById(containerId);
    //if it doesnt exist, stop
    if (!container) {
        return;
    }
    //clears children of the end-boxes id div
    container.replaceChildren();

    //if there are any boxes placed at all
    if (labels.length === 0) {
        const empty = document.createElement("p");
        empty.className = "end-empty";
        empty.textContent = "No boxes were placed.";
        container.append(empty);
        return;
    }

    //create a box for every label
    for (const label of labels) {
        const box = document.createElement("span");
        box.className = "end-box";
        box.textContent = label;
        container.append(box);
    }
}