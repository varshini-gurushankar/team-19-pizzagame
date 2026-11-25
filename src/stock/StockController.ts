import { SHELF_SIZE, StockModel, parseWeight, wrongIndexes, pickWeights } from "./StockModel";
import * as view from "./StockView";

const ROUND_MS = 80_000;

const model = new StockModel();
let selected: HTMLElement | null = null;
let dragging: HTMLElement | null = null;
let ghost: HTMLElement | null = null;
const blankDrag = new Image();
blankDrag.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
let wired = false;
let timer = 0;
let endsAt = 0;
let ended = false;

export function startRound(): void {
    wire();
    stopRound();
    model.reset();
    selected = null;
    ended = false;

    //at the start of every round 
    //put 8 new boxes onto the page with 8 random weight labels
    view.renderBoxes(pickWeights());      
    //for every box                              
    for (const box of view.allBoxes()) {
        //make it draggable
        box.draggable = true;
        //gets weight label of the box and if its null use the empty string
        //then parses that label into a numerical value so we can actually compare them
        //turns it back into strings since box.dataset.weight only stores strings
        box.dataset.weight = String(parseWeight(box.textContent ?? ""));
    }

    view.markSelected(null);
    view.clearWrong();
    view.setOrderHint("", false);
    view.setBoxesLeft(SHELF_SIZE);
    view.setCheckEnabled(false);
    view.setBanner("Drag the boxes onto the shelf in order from LEAST to GREATEST.");
    view.setPatience(ROUND_MS, ROUND_MS);
    endsAt = performance.now() + ROUND_MS;
    timer = window.setInterval(tick, 100);
}

export function stopRound(): void {
    window.clearInterval(timer);
    timer = 0;
    const dialog = document.getElementById("round-end");
    if (dialog instanceof HTMLDialogElement && dialog.open) {
        dialog.close();
    }
}

function tick(): void {
    const remaining = endsAt - performance.now();
    if (remaining <= 0) {
        view.setPatience(0, ROUND_MS);
        showRoundEnd(false);
        return;
    }
    view.setPatience(remaining, ROUND_MS);
}

function place(box: HTMLElement, slot: HTMLElement): void {
    if (ended) {
        return;
    }
    const index = Number(slot.dataset.slot);
    const previous = box.closest(".slot");
    if (previous === slot) {
        clearSelection();
        return;
    }

    const occupant = slot.querySelector(".box");
    if (occupant instanceof HTMLElement && occupant !== box) {
        swap(box, previous instanceof HTMLElement ? previous : null, occupant, slot);
        return;
    }

    if (previous instanceof HTMLElement) {
        model.clear(Number(previous.dataset.slot));
    }
    if (!model.place(index, weightOf(box))) {
        return;
    }
    view.moveToSlot(box, slot);
    clearSelection();
    clearCheck();
    refresh();
}

function swap(box: HTMLElement, previous: HTMLElement | null, occupant: HTMLElement, slot: HTMLElement): void {
    const index = Number(slot.dataset.slot);
    const boxWeight = weightOf(box);
    const occupantWeight = weightOf(occupant);

    if (previous) {
        const previousIndex = Number(previous.dataset.slot);
        model.clear(previousIndex);
        model.clear(index);
        model.place(index, boxWeight);
        model.place(previousIndex, occupantWeight);
        view.moveToPile(occupant);
        view.moveToSlot(box, slot);
        view.moveToSlot(occupant, previous);
    } else {
        model.clear(index);
        model.place(index, boxWeight);
        view.moveToPile(occupant);
        view.moveToSlot(box, slot);
    }

    clearSelection();
    clearCheck();
    refresh();
}

function weightOf(box: HTMLElement): number {
    return Number(box.dataset.weight);
}

function clearSelection(): void {
    selected = null;
    view.markSelected(null);
}

function returnBox(box: HTMLElement): void {
    if (ended) {
        return;
    }
    const slot = box.closest(".slot");
    if (!(slot instanceof HTMLElement)) {
        return;
    }
    model.clear(Number(slot.dataset.slot));
    view.moveToPile(box);
    clearSelection();
    clearCheck();
    refresh();
}

function refresh(): void {
    view.setBoxesLeft(SHELF_SIZE - model.filledCount());
    view.setCheckEnabled(!ended && model.isFull());
}

function checkOrder(): void {
    if (ended || !model.isFull()) {
        return;
    }
    const boxes = [...document.querySelectorAll("#shelf .slot .box")];
    const wrong = wrongIndexes(boxes.map((box) => box instanceof HTMLElement ? weightOf(box) : NaN));
    view.markWrong(wrong);
    if (wrong.length === 0) {
        view.setOrderHint("The shelf is in order.", false);
        showRoundEnd(true);
        return;
    }
    const noun = wrong.length === 1 ? "box is" : "boxes are";
    view.setOrderHint(`${wrong.length} ${noun} out of order. Compare again!`, true);
}

function showRoundEnd(won: boolean): void {
    stopRound();
    ended = true;
    view.setCheckEnabled(false);
    const dialog = document.getElementById("round-end");
    const title = document.getElementById("round-title");
    const message = document.getElementById("round-message");
    if (!(dialog instanceof HTMLDialogElement) || !title || !message || dialog.open) {
        return;
    }
    title.textContent = won ? "Congrats!" : "Oh No!";
    message.textContent = won ? "The shelf is in order." : "The driver left.";
    dialog.showModal();
}

function clearCheck(): void {
    view.clearWrong();
    view.setOrderHint("", false);
}

function select(box: HTMLElement): void {
    if (selected === box && box.closest(".slot")) {
        returnBox(box);
        return;
    }
    selected = selected === box ? null : box;
    view.markSelected(selected);
}

function showGhost(box: HTMLElement, x: number, y: number): void {
    hideGhost();
    ghost = box.cloneNode(true) as HTMLElement;
    ghost.classList.remove("selected");
    ghost.style.position = "fixed";
    ghost.style.left = "0";
    ghost.style.top = "0";
    ghost.style.margin = "0";
    ghost.style.width = `${box.offsetWidth}px`;
    ghost.style.height = `${box.offsetHeight}px`;
    ghost.style.opacity = "1";
    ghost.style.pointerEvents = "none";
    ghost.style.zIndex = "20";
    document.body.append(ghost);
    moveGhost(x, y);
}

function moveGhost(x: number, y: number): void {
    if (!ghost) {
        return;
    }
    ghost.style.transform = `translate(${x - ghost.offsetWidth / 2}px, ${y - ghost.offsetHeight / 2}px)`;
}

function hideGhost(): void {
    ghost?.remove();
    ghost = null;
}

function wire(): void {
    if (wired) {
        return;
    }
    wired = true;

    const pile = document.getElementById("box-pile");
    const delivery = document.getElementById("delivery-panel");
    const shelf = document.getElementById("shelf");

    delivery?.addEventListener("click", (event) => {
        const box = (event.target as HTMLElement).closest(".box");
        if (box instanceof HTMLElement) {
            select(box);
            return;
        }
        if (selected?.closest(".slot")) {
            returnBox(selected);
        }
    });

    shelf?.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const box = target.closest(".box");
        if (box instanceof HTMLElement) {
            const slot = box.closest(".slot");
            if (selected && selected !== box && slot instanceof HTMLElement) {
                place(selected, slot);
                return;
            }
            select(box);
            return;
        }
        const slot = target.closest(".slot");
        if (!(slot instanceof HTMLElement)) {
            return;
        }
        if (selected) {
            place(selected, slot);
            return;
        }
        const sitting = slot.querySelector(".box");
        if (sitting instanceof HTMLElement) {
            returnBox(sitting);
        }
    });

    document.addEventListener("dragstart", (event) => {
        const box = (event.target as HTMLElement).closest?.(".box");
        if (!(box instanceof HTMLElement) || ended) {
            event.preventDefault();
            return;
        }
        dragging = box;
        selected = null;
        view.markSelected(null);
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", box.dataset.weight ?? "");
            try {
                event.dataTransfer.setDragImage(blankDrag, 0, 0);
            } catch {
                // The browser keeps its own drag preview if this image is not ready.
            }
        }
        showGhost(box, event.clientX, event.clientY);
    });

    document.addEventListener("drag", (event) => {
        if (!ghost || (event.clientX === 0 && event.clientY === 0)) {
            return;
        }
        moveGhost(event.clientX, event.clientY);
    });

    document.addEventListener("dragend", () => {
        hideGhost();
    });

    const allowMove = (event: DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "move";
        }
    };
    shelf?.addEventListener("dragover", allowMove);
    delivery?.addEventListener("dragover", allowMove);
    pile?.addEventListener("dragover", allowMove);

    shelf?.addEventListener("drop", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const slot = (event.target as HTMLElement).closest(".slot");
        if (dragging && slot instanceof HTMLElement) {
            place(dragging, slot);
        }
        dragging = null;
    });

    delivery?.addEventListener("drop", (event) => {
        event.preventDefault();
        if (dragging) {
            returnBox(dragging);
        }
        dragging = null;
    });

    document.getElementById("check-order-button")?.addEventListener("click", checkOrder);
    document.getElementById("play-again")?.addEventListener("click", () => {
        startRound();
    });
    document.getElementById("return-menu")?.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}
