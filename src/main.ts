
/* maps game names to their file */
const pages: Record<string, string> = {
  "Main game": "game.html",
};

/* button logic */
document.querySelectorAll<HTMLButtonElement>(".game-button").forEach((button) => {

    // when button is clicked go to page associated with game
    button.addEventListener("click", () => {
        const game = button.dataset.game ?? "";
        const page = pages[game];
        window.location.href = page;
    });
});