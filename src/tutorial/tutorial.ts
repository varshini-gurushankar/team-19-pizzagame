interface TutorialStep {
    target: string;
    title: string;
    description: string;
}

const tutorialSteps: TutorialStep[] = [
    {
        target: "#customer-list",
        title: "Reading the customers order",
        description: "Read the active customers order, noting which toppings they want, and the amount of time you have to serve the pizza",
    },

    {
        target: ".slice-control",
        title: "Using the slice slider",
        description: "Use the slider to cut the pizza into the number of slices needed for the order.",
    },

    {
        target: "#pizza-container",
        title: "Build the customers pizza",
        description: "Drag the requested toppings onto the pizza to match the fractions in the order. The toppings are pepperoni, onion, olives, and basil. ",
    },

    {
        target: ".placed-topping-counts",
        title: "Keep track of each topping",
        description: "These counts show how many of each topping you have placed on the pizza.",
    },

    {
        target: "#undo-button",
        title: "Made a Mistake",
        description: "If you place the wrong topping, click Undo to remove the last topping you added.",
    },

    {
        target: "#serve-btn",
        title: "Serve the finished pizza",
        description: "When the slices and toppings match the order, click Serve Pizza.",
    },

];

export function setupTutorial(): void {
    const stepNumber = document.getElementById("step-number") as HTMLSpanElement;
    const stepTitle = document.getElementById("step-title") as HTMLHeadingElement;
    const stepDescription = document.getElementById("step-description") as HTMLParagraphElement;
    const progressLabel = document.querySelector(".tutorial-progress span") as HTMLSpanElement;
    const progressBar = document.querySelector(".tutorial-progress progress") as HTMLProgressElement;
    const previousButton = document.getElementById("previous-step") as HTMLButtonElement;
    const nextButton = document.getElementById("next-step") as HTMLButtonElement;

    let currentStep = 0;

    function showStep(index: number): void {
        const step = tutorialSteps[index];
        const target = document.querySelector(step.target) as HTMLElement;

        document.querySelector(".tutorial-highlight")?.classList.remove("tutorial-highlight");
        target.classList.add("tutorial-highlight");
        stepNumber.textContent = String(index + 1);


        stepTitle.textContent = step.title;
        stepDescription.textContent = step.description;
        progressLabel.textContent = `STEP ${index + 1} OF ${tutorialSteps.length}`;
        progressBar.value = index + 1;
        previousButton.disabled = index === 0;
        nextButton.textContent = index === tutorialSteps.length - 1 ? "Play Main Game" : "Next";
    }

    previousButton.addEventListener("click", () => {
        if (currentStep === 0) return;
        currentStep -= 1;
        showStep(currentStep);
    });

    nextButton.addEventListener("click", () => {
        //At step 6 of the tutoria -> make user start main game after finish 
        if (currentStep === tutorialSteps.length - 1) {
            window.location.href = "./game.html";
            return;
        }
        currentStep += 1;
        showStep(currentStep);
    });

    showStep(currentStep);
}
