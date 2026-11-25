import type { OvenResult } from "./OvenGameModel";

export class OvenResultView {
    private container: HTMLElement;
    private onNextQuestion: () => void;

    constructor(
        container: HTMLElement,
        onNextQuestion: () => void
    ) {
        this.container = container;
        this.onNextQuestion = onNextQuestion;
        this.hide();
    }

    // display the result after the player submits an answer
    show(result: OvenResult): void {
        const outcome = result.outcome;

        let title: string;
        let message: string;
        let image: string;

        if (outcome === "tooSoon") {
            title = "Too Soon!";
            message = "No points. Try again!";
            image = "🍕";
        } else if (outcome === "tooLate") {
            title = "Too Late!";
            message = "No points. Try again!";
            image = "🔥";
        } else {
            title = "Great!";
            message = `Good job! ${result.points} points rewarded!`;
            image = "⭐";
        }

        // create the result popup
        this.container.innerHTML = `
            <div class="oven-result-overlay">
                <div class="oven-result-card">
                    <h2 id="oven-result-title"></h2>
                    <div id="oven-result-image"></div>
                    <p id="oven-result-message"></p>

                    <button id="oven-next-question">
                        Next Question
                    </button>
                </div>
            </div>
        `;

        // update the result information
        const titleElement = this.container.querySelector(
            "#oven-result-title"
        ) as HTMLElement;

        const imageElement = this.container.querySelector(
            "#oven-result-image"
        ) as HTMLElement;

        const messageElement = this.container.querySelector(
            "#oven-result-message"
        ) as HTMLElement;

        titleElement.textContent = title;
        imageElement.textContent = image;
        messageElement.textContent = message;

        // connect the Next Question button
        const nextButton = this.container.querySelector(
            "#oven-next-question"
        ) as HTMLButtonElement;

        nextButton.addEventListener("click", () => {
            this.onNextQuestion();
            this.hide();
        });

        this.container.hidden = false;
        this.applyStyles();
        nextButton.focus();
    }

    // hide the result popup
    hide(): void {
        this.container.hidden = true;
        this.container.innerHTML = "";
    }

    // add styling to the result popup
    private applyStyles(): void {
        const overlay = this.container.querySelector(
            ".oven-result-overlay"
        ) as HTMLElement;

        const card = this.container.querySelector(
            ".oven-result-card"
        ) as HTMLElement;

        const image = this.container.querySelector(
            "#oven-result-image"
        ) as HTMLElement;

        const button = this.container.querySelector(
            "#oven-next-question"
        ) as HTMLButtonElement;

        Object.assign(overlay.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000"
        });

        Object.assign(card.style, {
            backgroundColor: "#fff8e6",
            border: "4px solid #263650",
            borderRadius: "16px",
            padding: "32px",
            textAlign: "center",
            width: "360px",
            maxWidth: "85vw",
            color: "#263650",
            boxShadow: "5px 5px 0px #c9a888"
        });

        Object.assign(image.style, {
            fontSize: "64px",
            margin: "20px"
        });

        Object.assign(button.style, {
            backgroundColor: "#e84c3d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "16px"
        });
    }
}
