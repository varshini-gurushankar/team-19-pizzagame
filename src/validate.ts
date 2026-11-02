import type { Order } from "./game.ts";
 
// Parameters def: 
// Order gets the current order
// Slices gets the amount of slices that user needs to produce 
// toppings: dict with the toppings (topping : amount)
export function validatePizza(order: Order, slices: number, toppings: Record<string, number>) : boolean{

    //Case if the user doesnt have the right amount of slices that we want 
    if (slices != order.slices){
        return false; 
    }

    //case if the user doesnt have the right topping proportions for customer 
    for (const requiredTopping of order.toppings){

        //customer topping specs
        const numer = requiredTopping.numerator
        const denom = requiredTopping.denominator

        //Get the expect number of topings that we should have 
        const expectedToppings = (numer / denom) * slices

        //Get the current toping number on the pizza
        const actual = toppings[requiredTopping.toppingName] ?? 0;

        if (expectedToppings != actual){
            return false; 
        }  
    }


    return true;
}