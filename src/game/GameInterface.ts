const WARNING_PERCENT = 50;
const DANGER_PERCENT = 25;

export class GameInterface {

  updatePatienceBar(time: number, percent: number): void {
    const fill = document.getElementById("patience-fill");
    const timeText = document.getElementById("patience-time");

    //either patience bar or timer text element wasnt found
    if (!fill || !timeText) return;

    //update the remaining time
    timeText.textContent = `${Math.ceil(time)}s`;
    //update the width of the par with the patience %
    fill.style.width = `${percent}%`;

    if (percent > WARNING_PERCENT) {
      fill.style.background = "#65b979"; // Green
    } else if (percent > DANGER_PERCENT) {
      fill.style.background = "#edb954"; // Yellow
    } else {
      fill.style.background = "#e46c6c"; // Red
    }
  }
}
