import { createPizza } from "./pizzaDrawing";
import { setupToppings } from "./toppingsView";
import { setupSliceSlider } from "./sliceSlider";

// create pizza
const pizza = createPizza("pizza-container");

if (pizza) {
    // toppings share the pizza's layer so they can be dragged onto it
    setupToppings(pizza.layer, pizza.pizzaSize);
    // draw this amount of slices 
    setupSliceSlider((slices) => pizza.setSlices(slices));
}
