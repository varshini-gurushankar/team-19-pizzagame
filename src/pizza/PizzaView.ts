import Konva from "konva";

// pick colors
const CRUST_COLOR = "#c97b36";
const CHEESE_COLOR = "#f7d56e";
const CUT_COLOR = "#7a3b1f";

// pizza max_size in px, cheese ratio multiplier leaves the rest for the crust
const MAX_SIZE = 420;
const CHEESE_RATIO = 0.9;
// room under the pie so toppings can sit in the same canvas and be dragged onto it
const TRAY_HEIGHT = 120;

// <---- commenting this out for now since I moved them to sliceLimits.ts
// so that setSlices(0) doesnt result in doing 360/0
//export const MIN_SLICES = 1;
//export const MAX_SLICES = 10;
import { MIN_SLICES, MAX_SLICES } from "./sliceLimits";
export { MIN_SLICES, MAX_SLICES } from "./sliceLimits"; //rexport so if someone is still using these variables, it'll continue to work

//create pizza interface usable in other files promises setSlices function
export interface Pizza {
    setSlices(slices: number): void;
    layer: Konva.Layer;
    pizzaSize: number;
}

//function that makes pizza, takes html element, returns null
export function createPizza(containerId: string): Pizza | null {
    //finds html container
    const container = document.getElementById(containerId);

    //makes sure if container even exists to prevent drawing in nonexistent container
    if (!container) {
        console.error(`Pizza container "${containerId}" not found`);
        return null;
    }

    // makes sure pizza isn't too big and scales to size of container
    const size = Math.min(container.clientWidth, MAX_SIZE);

    //finds center of container
    const center = size / 2;

    // margin
    const radius = size / 2 - 4;

    // keep cheese outside of crust
    const cheeseRadius = radius * CHEESE_RATIO;

    // pie on top, topping tray in the extra height so both live in this container
    const stage = new Konva.Stage({
        container: containerId,
        width: size,
        height: size + TRAY_HEIGHT,
    });

    //create layer
    const layer = new Konva.Layer();
    stage.add(layer);

    // draw crust
    layer.add(new Konva.Circle({ x: center, y: center, radius, fill: CRUST_COLOR }));

    // draw slices using group of shapes (place origin of shapes at center)
    const sliceGroup = new Konva.Group({ x: center, y: center });
    layer.add(sliceGroup);

    // function for making x slices
    function setSlices(slices: number): void {
        // delete old slices in the sliceGroup before making new ones

        if (!Number.isInteger(slices) || slices < MIN_SLICES || slices > MAX_SLICES) {
            console.error(`Invalid slice count: ${slices}`);
            return;
        }
        
        sliceGroup.destroyChildren();

        // 1 slice = blank pizza
        if (slices === 1) {
            sliceGroup.add(new Konva.Circle({
                radius: cheeseRadius,
                fill: CHEESE_COLOR,
                stroke: CUT_COLOR,
                strokeWidth: 3,
            }));
            return;
        }

        // each slice should be equal, so 360/slices for correct slice angles
        const angle = 360 / slices;

        for (let i = 0; i < slices; i++) {
            sliceGroup.add(new Konva.Wedge({
                // slice goes to crust
                radius: cheeseRadius,
                angle,
                // -90 offset so that first wedge begins at top of circle then rotates starting from this position instead
                rotation: i * angle - 90, 

                // colors of slices
                fill: CHEESE_COLOR,
                stroke: CUT_COLOR,
                strokeWidth: 3,
            }));
        }
    }

    //returns pizza object with setSlices function so that createPizza can use it
    return {
        setSlices: setSlices,
        layer,
        pizzaSize: size,
    };
}
type Toppings = "pepperoni" | "onions" | "olives" | "basil";

type ToppingClone = {
	type: Toppings;
	node: Konva.Node;
}

// Array that saves all copies of cloned toppings
export const toppingClonesArray: ToppingClone[] = [];

export function setupToppings(layer: Konva.Layer, pizzaSize: number): void {
	const trayY = pizzaSize + 58;
	const margin = 46;
	const span = pizzaSize - margin * 2;
	const xs = [0, 1, 2, 3].map((i) => margin + (span * i) / 3);


/******************************************************************************
 * Pepperoni Topping Code
 *****************************************************************************/

const pepperoniTopping = new Konva.Circle({
	x: xs[0],
	y: trayY,
	radius: 30,
	fill: 'red',
	stroke: 'black',
	strokeWidth: 2,
	draggable: true,
});
pepperoniTopping.on('mouseover', function () {
	document.body.style.cursor = 'pointer';
});
pepperoniTopping.on('mouseout', function () {
	document.body.style.cursor = 'default';
});
pepperoniTopping.on("dragend", function () {
	cloneFactory(this, "pepperoni", xs[0]);
});


/******************************************************************************
 * Onions Topping Code
 *****************************************************************************/

const onionsTopping = new Konva.Group({
	x: xs[1],
	y: trayY,
	rotation: -15,
	draggable: true,
});
onionsTopping.add(new Konva.Ellipse({
	x: 0,
	y: 0,
	radiusX: 32,
	radiusY: 22,
	fill: '#e7a2bc',
	stroke: '#c66f96',
	strokeWidth: 2,
}));
onionsTopping.add(new Konva.Ellipse({
	x: 0,
	y: 0,
	radiusX: 24,
	radiusY: 14,
	fill: '#fffdf4', // match the background behind the onion
	stroke: '#f6d5e1',
	strokeWidth: 2,
}));
onionsTopping.on('mouseover', function () {
	document.body.style.cursor = 'pointer';
});
onionsTopping.on('mouseout', function () {
	document.body.style.cursor = 'default';
});
onionsTopping.on("dragend", function () {
	cloneFactory(this, "onions", xs[1]);
});


/******************************************************************************
 * Olives Topping Code
 *****************************************************************************/

const olivesTopping = new Konva.Group({
	x: xs[2],
	y: trayY,
	rotation: -155,
	draggable: true,
});
olivesTopping.add(new Konva.Ellipse({
	x: 0,
	y: 0,
	radiusX: 35,
	radiusY: 29,
	fill: '#665f4d',
	stroke: 'black',
	strokeWidth: 2,
}));
olivesTopping.add(new Konva.Ellipse({
	x: 0,
	y: 0,
	radiusX: 24,
	radiusY: 17,
	fill: '#fffdf4',
	stroke: '#6b5d3d',
	strokeWidth: 5,
}));
olivesTopping.on('mouseover', function () {
	document.body.style.cursor = 'pointer';
});
olivesTopping.on('mouseout', function () {
	document.body.style.cursor = 'default';
});
olivesTopping.on("dragend", function () {
	cloneFactory(this, "olives", xs[2]);
});


/******************************************************************************
 * Basil Topping Code
 *****************************************************************************/

const basilTopping = new Konva.Group({
	x: xs[3],
	y: trayY,
	draggable: true,
});
basilTopping.add(new Konva.Line({
	points: [
		-35,   0,
		-25,  -8,
		-10, -13,
		  8, -14,
		 25,  -8,
		 35,   0,
		 25,   8,
		  8,  14,
		-10,  13,
		-25,   8,
	],
	closed: true,
	tension: 0.25,
	fill: '#58a83f',
	stroke: '#286b31',
	strokeWidth: 2,
	lineJoin: 'round',
}));
basilTopping.add(new Konva.Line({
	points: [
		-32, 0,
		-12, 1,
		  8, 0,
		 32, 0,
	],
	tension: 0.3,
	stroke: '#286b31',
	strokeWidth: 1.5,
	lineCap: 'round',
}));
basilTopping.on('mouseover', function () {
	document.body.style.cursor = 'pointer';
});
basilTopping.on('mouseout', function () {
	document.body.style.cursor = 'default';
});
basilTopping.on("dragend", function () {
	cloneFactory(this, "basil", xs[3]);
});


/******************************************************************************
 * Topping Cloning
 *****************************************************************************/

function cloneFactory(node: Konva.Node, type: Toppings, x0: number): void {
	const copy = node.clone({
		x: node.x(),
		y: node.y(),
		draggable: true,
	});
	node.position({ x: x0, y: trayY });
	layer.add(copy);

	console.log("Added: " + copy);

	copy.moveToTop();
	// Push to array
	toppingClonesArray.push({ type, node: copy });
	layer.batchDraw();
}


/******************************************************************************
 * Add layers and present to stage
 *****************************************************************************/

layer.add(pepperoniTopping);
layer.add(onionsTopping);
layer.add(olivesTopping);
layer.add(basilTopping);
layer.batchDraw();
}
