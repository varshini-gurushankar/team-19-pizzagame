interface TutorialStep {
    target: string;
    title: string;
    description: string;
}

const tutorialSteps: TutorialStep[] = [
    {
        target: "#customer-list",
        title: "Read the customer’s fractions",
        description: "Read the active customer’s order and note which toppings they want.",
    },

    {
        target: ".slice-control",
        title: "Set the number of slices",
        description: "Use the slider to cut the pizza into the number of slices needed for the order.",
    },

    {
        target: "#pizza-container",
        title: "Build the customer’s pizza",
        description: "Drag the requested toppings onto the pizza to match the fractions in the order.",
    },

    {
        target: ".placed-topping-counts",
        title: "Keep track of each topping",
        description: "These counts show how many of each topping you have placed on the pizza.",
    },

    {
        target: "#undo-button",
        title: "Undo your last topping",
        description: "If you place the wrong topping, click Undo to remove the last one you added.",
    },

    {
        target: "#serve-btn",
        title: "Serve the finished pizza",
        description: "When the slices and toppings match the order, click Serve Pizza.",
    },

];

export function setupTutorial(): void {
    const stepNumber = document.getElementById("step-number");
    const stepTitle = document.getElementById("step-title");
    const stepDescription = document.getElementById("step-description");
    const progressLabel = document.querySelector(".tutorial-progress span");
    const progressBar = document.querySelector(".tutorial-progress progress");
    const previousButton = document.getElementById("previous-step");
    const nextButton = document.getElementById("next-step");

    let currentStep = 0;

    function showStep(index: number): void {
        const step = tutorialSteps[index];
        const target = document.querySelector(step.target);

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
