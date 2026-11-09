import { describe, it, expect, vi, beforeEach } from "vitest";

// replaces file with a mock that provides a fake mock function
// we dont need to test those functions again
// we just want to know that the file is communicating with the other files correctly
vi.mock("../../pizza/PizzaView", () => ({ createPizza: vi.fn(), setupToppings: vi.fn() }));
vi.mock("../../pizza/sliceSlider", () => ({ setupSliceSlider: vi.fn() }));

async function loadPage() {
    const { createPizza, setupToppings } = await import("../../pizza/PizzaView");
    const { setupSliceSlider } = await import("../../pizza/sliceSlider");
    return {
        createPizza: vi.mocked(createPizza),
        setupToppings: vi.mocked(setupToppings),
        setupSliceSlider: vi.mocked(setupSliceSlider),
        run: async () => {
            const { setupPizza } = await import("../../pizza/PizzaController");
            setupPizza();
        },
    };
}

//fake pizza with amount of slices, empty object for the layer, and max sized 420px pizza
function makeFakePizza() {
    return { setSlices: vi.fn(), layer: {} as any, pizzaSize: 420 };
}

// before each test
beforeEach(() => {
    // resets module cache so that every import of pizzaAssembly runs correctly
    vi.resetModules();
    // clears history of mock functions to prevent later tests seeing old test call history
    vi.clearAllMocks();
});

describe("pizzaAssembly wiring", () => {
    //makes sure pizzaAssembly asks createPizza to make a pizza in the right container
    it("draws the pizza in the pizza container", async () => {
        const page = await loadPage();

        //when pizzaAssembly calls createPizza("pizza-container"), use fake pizza
        page.createPizza.mockReturnValue(makeFakePizza());

        //run pizzaAssembly.ts
        await page.run();

        //makes sure createPizza() was called in the correct container
        expect(page.createPizza).toHaveBeenCalledWith("pizza-container");
    });

    it("gives the toppings the pizza's layer and size", async () => {
        const page = await loadPage();
        const pizza = makeFakePizza();

        page.createPizza.mockReturnValue(pizza);

        await page.run();

        //was setupToppings called with pizza.layer and 420px
        expect(page.setupToppings).toHaveBeenCalledWith(pizza.layer, 420);
    });

    it("redraws the pizza when the slider changes", async () => {
        const page = await loadPage();
        const pizza = makeFakePizza();
        page.createPizza.mockReturnValue(pizza);
        await page.run();

        // setupSliceSlider.mock.calls is the first time setupSliceSlider was called
        // first 0 gets the first function call
        // second 0 gets the first argument of that function call
        const onChange = page.setupSliceSlider.mock.calls[0][0];

        //slider moved to 5
        onChange(5);

        // makes sure that pizzaAssembly gave a call to the slider, and slider gave 5
        // and we used that 5 on pizza.setSlices(5)
        expect(pizza.setSlices).toHaveBeenCalledWith(5);
    });

    it("sets up nothing else when the pizza can't be created", async () => {
        const page = await loadPage();
        //pizza wasnt created
        page.createPizza.mockReturnValue(null);

        await page.run();

        //other functions werent called because of absence of the pizza
        expect(page.setupToppings).not.toHaveBeenCalled();
        expect(page.setupSliceSlider).not.toHaveBeenCalled();
    });
});