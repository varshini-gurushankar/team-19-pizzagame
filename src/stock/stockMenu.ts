// screens html ids list; will add game-screen, win-screen, lose-screen, etc later
const screenIds = ["intro-screen", "howto-screen"] as const;
//makes type ScreenId, so only valid screenIds work
type ScreenId = (typeof screenIds)[number];

// shows the screen with the given screenId and then hides the other screens
export function showScreen(id: ScreenId): void {
    for (const screenId of screenIds) {
        //gets html element with respective id
        const screen = document.getElementById(screenId);
        //if screen exists
        if (screen) {
            //shows given screen, hides the others
            screen.hidden = screenId !== id;
        }
    }
}

// connects a button to a function, and warns if the button is missing from the page
function onClick(buttonId: string, handler: () => void): void {
    //gets html element with respective id
    const button = document.getElementById(buttonId);
    //if doesnt button exists
    if (!button) {
        console.error(`Button "${buttonId}" not found`);
        return;
    }
    button.addEventListener("click", handler);
}

// placeholder until the sorting game exists
function startGame(): void {
    console.log("W.I.P");
}

//button to screen linkage
onClick("howto-button", () => showScreen("howto-screen"));
onClick("howto-back-button", () => showScreen("intro-screen"));
onClick("start-button", startGame);
onClick("howto-start-button", startGame);