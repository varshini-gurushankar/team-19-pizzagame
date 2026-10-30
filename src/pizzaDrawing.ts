import Konva from "konva";

// pick colors
const CRUST_COLOR = "#c97b36";
const CHEESE_COLOR = "#f7d56e";
const CUT_COLOR = "#7a3b1f";

// pizza max_size in px, cheese ratio multiplier leaves the rest for the crust
const MAX_SIZE = 420;
const CHEESE_RATIO = 0.9;

//create pizza interface usable in other files promises setSlices function
export interface Pizza {
    setSlices(slices: number): void;
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

    //main drawing area
    const stage = new Konva.Stage({ container: containerId, width: size, height: size });

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
        setSlices: setSlices
    };
}