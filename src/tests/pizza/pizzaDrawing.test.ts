// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// since we dont need actual drawings to check if pizza is being drew correctly
// have fake Konva which remembers position, size, angle, rotation, container, etc
// vi.hoisted() makes sure that our fake Konva exists before vitest uses it later
const fakeKonva = vi.hoisted(() => {
    class FakeNode {
        // stores information like coordinates, radius into config object
        // if nothing provided it is empty object {}
        config: Record<string, any>;
        constructor(config: Record<string, any> = {}) {
            this.config = config;
        }
    }

    // fake container has config property and constructor from fakenode
    class FakeContainer extends FakeNode {
        //stores shapes in the container
        children: FakeNode[] = [];

        //adds shape into children array
        // this will mock things like layer.add();
        add(child: FakeNode) {
            this.children.push(child);
            return this;
        }

        //removes all children from a container
        // this will mock layer.destroyChildren();
        destroyChildren() {
            this.children = [];
            return this;
        }
    }

    ///array of created stages
    const stages: FakeContainer[] = [];

    // stage can contain other objects
    class Stage extends FakeContainer {
        // stores the configurations that a stage is created with like width and height
        constructor(config: Record<string, any>) {
            //calls constructor of parent class of FakeContainer, FakeNode
            super(config);
            // adds stage to array of stages
            stages.push(this);
        }
    }
    //layer and group contain other shapes so inherit from FakeContainer
    class Layer extends FakeContainer {}
    class Group extends FakeContainer {}

    //circle and wedge inherits from FakeNode directly since they are individual shapes
    class Circle extends FakeNode {}
    class Wedge extends FakeNode {}

    // so that we can access all the classes in our fakeKonva
    return { stages, Konva: { Stage, Layer, Group, Circle, Wedge } };
});

// replaces konva library with fake mockup konva we made
vi.mock("konva", () => ({ default: fakeKonva.Konva }));

import { createPizza, MAX_SLICES } from "../../pizza/PizzaView";

// extracts Circle and Wedge classes so that we can write:
// Circle instead of fakeKonva.Konva.Circle
// Wedge instead of fakeKonva.Konva.Wedge
const { Circle, Wedge } = fakeKonva.Konva;

// makes HTML container for pizza to be drawn
function addContainer(width: number): void {
    document.body.innerHTML = `<div id="pizza-container"></div>`;
    // ! means that we are confident it'll never return null
    const container = document.getElementById("pizza-container")!;
    // manually sets clientWidth property 
    Object.defineProperty(container, "clientWidth", { value: width });
}

// first child is crust, second child is group for slices
function crustOf(pizza: any) {
    //returns crust
    return pizza.layer.children[0];
}
function slicesOf(pizza: any): any[] {
    //returns array of all pizza slices to check how many slices were created
    return pizza.layer.children[1].children;
}

//before every test clear stages array, so that we don't accidentally retrieve a stage from another test
beforeEach(() => {
    fakeKonva.stages.length = 0;
});

// after every test remove all HTML elements
afterEach(() => {
    document.body.innerHTML = "";
    // specifically for the tests we do where we purposely create an error, so that it doesn't
    // affect other tests afterwards
    vi.restoreAllMocks();
});

//tests for createPizza() function
describe("createPizza", () => {

    it("returns null and logs an error when the container is missing", () => {
        // detects error without printing the error during the test
        const error = vi.spyOn(console, "error").mockImplementation(() => {});

        expect(createPizza("does-not-exist")).toBeNull();
        expect(error).toHaveBeenCalled();
    });

    it("caps the pizza size at 420px in a wide container", () => {
        addContainer(800);

        const pizza = createPizza("pizza-container")!;

        //since max size of pizza is 420px
        expect(pizza.pizzaSize).toBe(420);
    });


    it("shrinks the pizza to fit a narrow container", () => {
        addContainer(300);

        const pizza = createPizza("pizza-container")!;


        //since pizza is the size of the width of the container unless width of container is larger than 420
        expect(pizza.pizzaSize).toBe(300);
    });

    it("makes the stage taller than the pizza to fit the toppings tray", () => {
        addContainer(800);

        createPizza("pizza-container");

        const stage = fakeKonva.stages[0];
        //since pizza max size is 420
        expect(stage.config.width).toBe(420);
        //since need toppings tray to be on the same stage as the pizza to drag toppings
        expect(stage.config.height).toBeGreaterThan(420);
    });

    it("centers the crust in the pizza area", () => {
        addContainer(800);

        const pizza = createPizza("pizza-container")!;
        const crust = crustOf(pizza);

        expect(crust).toBeInstanceOf(Circle);
        //since max width of pizza is 420, so width is 420 and center is 420/2
        // which is 210
        expect(crust.config.x).toBe(210);
        expect(crust.config.y).toBe(210);
    });
});

describe("setSlices", () => {
    it("draws a single uncut circle for 1 slice", () => {
        addContainer(800);
        const pizza = createPizza("pizza-container")!;

        pizza.setSlices(1);

        //makes an array of the shapes inside of the pizza's slice group
        const slices = slicesOf(pizza);

        expect(slices).toHaveLength(1);
        //should be just a circle since one slice means pizza is uncut
        expect(slices[0]).toBeInstanceOf(Circle);
    });

    it("draws one equal wedge per slice, starting at 12 o'clock", () => {
        addContainer(800);
        const pizza = createPizza("pizza-container")!;

        pizza.setSlices(4);

        const slices = slicesOf(pizza);
        expect(slices).toHaveLength(4);
        slices.forEach((slice) => {
            //all slices should be wedges
            expect(slice).toBeInstanceOf(Wedge);
            //4 slices means each slice has a 90 degree angle since 360/4=90
            expect(slice.config.angle).toBe(90);
        });
        // correct angles taking into account -90 offset for first cut
        expect(slices.map((s) => s.config.rotation)).toEqual([-90, 0, 90, 180]);
    });

    it("maximum slice count", () => {
        addContainer(800);
        const pizza = createPizza("pizza-container")!;

        pizza.setSlices(MAX_SLICES);

        const slices = slicesOf(pizza);
        expect(slices).toHaveLength(10);
        slices.forEach((slice) => {
            //all slices should be wedges
            expect(slice).toBeInstanceOf(Wedge);
            //10 slices means each slice has a 90 degree angle since 360/10=36
            expect(slice.config.angle).toBe(36);
        });
        // correct angles taking into account -90 offset for first cut
        expect(slices.map((s) => s.config.rotation)).toEqual([-90, -54, -18, 18, 54, 90, 126, 162, 198, 234]);
    });

    it("replaces the old slices when re-cut", () => {
        addContainer(800);
        const pizza = createPizza("pizza-container")!;

        pizza.setSlices(8);
        pizza.setSlices(3);

        expect(slicesOf(pizza)).toHaveLength(3);
    });

    //it.each lets us run the same test with different inputs
    it.each([0, -2, 11, 2.5, NaN])(
        "ignores invalid slice count %s and keeps the current pizza",
        (invalid) => {
            addContainer(800);
            const pizza = createPizza("pizza-container")!;
            // checks for error without giving actual error messages in the test output
            vi.spyOn(console, "error").mockImplementation(() => {});
            pizza.setSlices(4);

            pizza.setSlices(invalid);

            // makes sure that just because something happened to make the slices an invalid
            // input, it keeps the old valid input
            expect(slicesOf(pizza)).toHaveLength(4);
            expect(console.error).toHaveBeenCalled();
        }
    );
});