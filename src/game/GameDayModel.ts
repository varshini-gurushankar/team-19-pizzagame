
export type DayStatus = "ready" | "active" | "complete";

export class GameDayModel {
    private currentDay = 1;
    private status: DayStatus = "ready";
    private daysFinished = 0;

    // get the current game day
    getCurrentDay(): number {
        return this.currentDay;
    }

    // get the current day's status
    getStatus(): DayStatus {
        return this.status;
    }

    // get the total number of completed days
    getDaysFinished(): number {
        return this.daysFinished;
    }

    // start the current game day
    startDay(): boolean {
        if (this.status !== "ready") {
            return false;
        }

        this.status = "active";
        return true;
    }

    // end the current game day
    endDay(): boolean {
        if (this.status !== "active") {
            return false;
        }

        this.status = "complete";
        this.daysFinished++;
        return true;
    }

    // increments the day number and prepares the next day
    nextDay(): boolean {
        if (this.status !== "complete") {
            return false;
        }

        this.currentDay++;
        this.status = "ready";
        return true;
    }
}
