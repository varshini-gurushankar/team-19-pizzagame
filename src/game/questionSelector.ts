/**
 * This file contains functions to help select the questions for the day.
 *  It needs to select questions for each day, prioritize prviously missed
 *  questions, avoid repeated questions within a day, and mix new questions
 *  with review questions.
 */

import {
    getQuestionsByDifficulty,
    getQuestionById,
    type Question,
    type Difficulty,
} from "../customer/QuestionBank"


/** Variables and Types */

export type QuestionResult = {
    success:  boolean;
    question: Question;
};

let playerTier: Difficulty = "easy";
const NUM_OF_QUESTIONS: number = 10;
const HIGH_SCORE: number = 0.9;
const LOW_SCORE: number = 0.5;

/** Function Definitions */

/**
 * Helper Function for shuffling questions in array . .
 * Fisher–Yates shuffling algorithm, from this Stack Overflow answer:
 *      https://stackoverflow.com/a/2450976
 * @param arr array that you want to shuffle
 * @return shuffled array
 */
function FY_shuffle(arr: QuestionResult[]): QuestionResult[] {
    let currIndex = arr.length;
    while (currIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currIndex);
        --currIndex;
        [arr[currIndex], arr[randomIndex]] = [arr[randomIndex], arr[currIndex]];
    }
    return arr;
}

/**
 * Helper Function to normalize player's score to a number in interval [0, 1]
 * @param playerData array of player scores from the previous day d-1
 * @param recentScores array of scores from day d-2
 * @return real number in interval [0, 1]
 */
function playerSuccessRate(
    playerData:   QuestionResult[],
    recentScores: QuestionResult[]
): number {
    var arr = recentScores.concat(playerData);
    let totalSuccess: number = 0;
    for(let i = 0; i < arr.length; ++i)
        if(arr[i].success)
            ++totalSuccess;

    // the check avoids dividing by zero
    return arr.length === 0 ? 0 : totalSuccess / arr.length;
}

/**
 * Helper function that updates the player's "tier," which decides the level of
 *  difficulty that the player receives.
 *      Easy -> Medium
 *      Medium -> Hard
 *  There is no rankDown function.
 */
function rankUp(): void {
    if(playerTier === "easy")
        playerTier = "medium";
    else if(playerTier === "medium")
        playerTier = "hard";
    console.log("Ranked Up!. . " + playerTier);
}

/**
 * Daily Question Picker.
 * Called at the beginning of every new day.
 * @param day the current day d
 * @param playerData array of player scores from the previous day d-1
 * @param recentScores array of scores from day d-2
 * @param missedQuestions array of total missed questions
 * @return array of the day's daily questions
 */
export function dailyQuestionPicker(
    day: number,
    playerData:      QuestionResult[],
    recentScores:    QuestionResult[],
    missedQuestions: Question["id"][]
): QuestionResult[] {
    // The array that will be returned to after being populated with questions.
    let result: QuestionResult[] = [];

    // By default, the player can retry up to 40% of their missed questions.
    let numOfReviewQ: number = 4;

    /**
     * This day checker checks whether the player just started the game or not.
     *  If so, just give player 10 easy questions.
     * So, the if-statement below checks that the player has been playing for
     *  long enough.
     */
    if(day > 2) {
        /**
         * For all days after the first two, we have more data to decide what
         *  type of difficulty the player needs.
         */
        let rcLen: number = recentScores.length;
        if(rcLen >= NUM_OF_QUESTIONS) {
            let norm: number = playerSuccessRate(playerData, recentScores);
            console.log("NORM: " + norm);

            // If the player has been doing very well (over 90%), rank up!
            if(
                (playerTier !== "hard") &&
                (norm >= HIGH_SCORE)
            )
                rankUp();

            /**
             * Give up to 5 review questions if the player has been doing poorly
             *  (below 50%)
             */
            else if(norm < LOW_SCORE)
                numOfReviewQ = 5;
        }
    }

    // Pool of questions with respect to player's tier
    const questionPool: Question[] = [...getQuestionsByDifficulty(playerTier)];

    /**
     * If there are any questions in reviewQueue, add up to 4 to result[]
     *  (up to 5 if player hasn't been doing well, see the variable
     *  numOfReviewQ).
     */
    let mqLen: number = missedQuestions.length;
    if(mqLen > 0)
        for(let i = 0; (i < numOfReviewQ) && (i < mqLen); ++i) {
            const id = missedQuestions.shift()!;
            const question = getQuestionById(id);
            if(question)
                result.push({ success: false, question });
        }

    let j = result.length;
    while(
        (questionPool.length > 0) &&
        (j < NUM_OF_QUESTIONS)
    ) {
        const randomIndex = Math.floor(Math.random() * questionPool.length);
        const [randElement] = questionPool.splice(randomIndex, 1);

        // Do not add duplicates
        if(
            (randElement) &&
            (!result.some(question => question.question.id === randElement.id))
        ) {
            result.push({ success: false, question: randElement });
            ++j;
        }
    }

    // Shuffle questions before returning
    return FY_shuffle(result);
}
