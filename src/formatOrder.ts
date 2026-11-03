export interface OrderText {
    slices: number;
    toppings: {
        toppingName: string;
        numerator: number;
        denominator: number;
    }[];
    showDecimal: boolean;
}

// terminating values stay short (0.5); repeating values round to 3 places (0.333)
function formatAmount(numerator: number, denominator: number, showDecimal: boolean): string {
    if (!showDecimal || denominator === 0) {
        return `${numerator}/${denominator}`;
    }

    const value = numerator / denominator;
    const rounded = Math.round(value * 1000) / 1000;

    if (Math.abs(rounded - value) < 1e-9) {
        return String(rounded);
    }

    return rounded.toFixed(3);
}

export function formatOrder(order: OrderText): string {
    const sliceSentence = `Cut into ${order.slices} slices.`;

    if (order.toppings.length === 0) {
        return sliceSentence;
    }

    const parts = order.toppings.map((topping) => {
        const amount = formatAmount(topping.numerator, topping.denominator, order.showDecimal);
        return `${amount} ${topping.toppingName}`;
    });

    return `${sliceSentence} ${parts.join(" and ")}.`;
}
