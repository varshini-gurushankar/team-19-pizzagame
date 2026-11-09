// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from "vitest";

const { toppingClonesArray } = vi.hoisted(() => ({
    toppingClonesArray: [] as any[],
}));

// Replace the real toppingsView module with a simple test array.
vi.mock("../toppingsView", () => ({ toppingClonesArray }));

beforeEach(() => {
    vi.resetModules();
    toppingClonesArray.length = 0;
    document.body.innerHTML = '<button id="undo-button"></button>';
});

it("removes the last topping when Undo is clicked", async () => {
    const destroy = vi.fn();
    const batchDraw = vi.fn();
    const layer = { batchDraw };

    toppingClonesArray.push({
        type: "pepperoni",
        node: {
            getLayer: () => layer,
                            destroy,
        },
    });

    // Import after adding the button: your file looks for it immediately.
    await import("../undoButton");

    document.getElementById("undo-button")!.click();

    expect(toppingClonesArray).toHaveLength(0);
    expect(destroy).toHaveBeenCalledOnce();
    expect(batchDraw).toHaveBeenCalledOnce();
});
