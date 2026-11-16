
import { GameDayModel } from "./GameDayModel";

// functions provided by the other game systems
export interface GameDayDependencies {
    // task 2: check if all customers are finished
    areCustomersFinished: () => boolean;

    // tasks 2 and 6: set up the next day's customers and questions, and reset temporary gameplay state
    prepareDay: (day: number) => void | Promise<void>;

    // task 5: notify the UI when a day starts
    onDayStarted?: (day: number) => void;

    // task 5: notify the UI when a day ends
    onDayEnded?: (day: number) => void;
}

export class GameDayController {
    private model: GameDayModel;
    private dependencies: GameDayDependencies;
    // tracks whether startDay() is currently preparing a day
    private startingDay: boolean = false;

    constructor(dependencies: GameDayDependencies) {
        this.model = new GameDayModel();
        this.dependencies = dependencies;
    }

    // get the current day number
    getCurrentDay(): number {
        return this.model.getCurrentDay();
    }

    // get how many days have been completed
    getDaysFinished(): number {
        return this.model.getDaysFinished();
    }

    // start a game day
    async startDay(): Promise<boolean> {
        if (this.startingDay || this.model.getStatus() !== "ready") {
            return false;
        }

        this.startingDay = true;

        try {
            const day = this.model.getCurrentDay();

            // ask other systems to prepare this day's gameplay
            // controller waits for the other systems to prepare the new day's questions and customers
            await this.dependencies.prepareDay(day);

            // mark the day as active
            this.model.startDay();

            // notify the UI
            this.dependencies.onDayStarted?.(day);

            return true;
        } finally {
            this.startingDay = false;
        }
    }

    // check whether the current game day is over
    checkDayComplete(): boolean {
        if (this.model.getStatus() !== "active") {
            return false;
        }

        // ask the customer system whether everyone is done
        if (!this.dependencies.areCustomersFinished()) {
            return false;
        }

        // end the day
        this.model.endDay();

        // notify the UI to display the end-of-day screen
        this.dependencies.onDayEnded?.(
            this.model.getCurrentDay()
        );

        return true;
    }

    // advance to the next day and start it
    async nextDay(): Promise<boolean> {
        if (!this.model.nextDay()) {
            return false;
        }

        return this.startDay();
    }
}
