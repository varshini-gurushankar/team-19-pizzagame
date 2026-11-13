import type { Order } from "../customer/CustomerModel";

type PizzaData = {
    toppings: Record<string, number>;
    //Stores position and size of the topping
    placedToppings: {
        x: number;
        y: number;
        radius: number;
    }[];
    pizzaSize: number;
};

// Parameters def:
// Order gets the current order
// Slices gets the amount of slices that user needs to produce
// pizzaSpec: data type with all the pizza specs like toppings, and position 
export function validatePizza(order: Order, slices: number, pizzaSpec: PizzaData) : boolean{

    //Case if the user doesnt have the right amount of slices that we want
    if (slices != order.slices){
        return false;
    }

    //Making sure that all toppings are on the pizza in valid spot, and has a position 
    let totalToppingsCount = 0;
    for (const toppingName in pizzaSpec.toppings) {
        totalToppingsCount += pizzaSpec.toppings[toppingName];
    }

    if (totalToppingsCount !== pizzaSpec.placedToppings.length) {
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
        const actual = pizzaSpec.toppings[requiredTopping.toppingName] ?? 0;

        if (expectedToppings != actual){
            return false;
        }

        //Check for extra toppings on the pizza that is not needed 
        for (const toppingName in pizzaSpec.toppings) {

            const found = order.toppings.find(requiredTopping => requiredTopping.toppingName === toppingName);

            if (found === undefined && pizzaSpec.toppings[toppingName] > 0) {
                return false;
            }
        }

        
        //Check for topping that falls outside pizza (currently if on crust: okay)
        const radPizza = pizzaSpec.pizzaSize / 2 

        for (const topping of pizzaSpec.placedToppings){

            //Testing coordinate system when placing topping 
            // console.log("Topping X:", topping.x);
            // console.log("Topping Y:", topping.y);

            const x_dist = topping.x - radPizza;
            const y_dist = topping.y - radPizza;

            const overall_distance = Math.sqrt(x_dist ** 2 + y_dist ** 2);
            
            //If distance is greater than the radius then that means that the topping is outside of the pizza 
            if (overall_distance + topping.radius > radPizza) {
                return false;
            }
        }

    }


    return true;
}
