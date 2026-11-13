/**
 * == GOAL ==
 * select questions for each day,
 * prioritize prviously missed questions,
 * avoid repeated questions within a day,
 * and mix new questions with review questions
 */

/******************************************************************************
 * PLACEHOLDER ARRAYS
 *****************************************************************************/

// easy placeholder array
const easyQuestionsPlaceholderArray: number[] = [
     0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
    50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
    70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
    80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
    90, 91, 92, 93, 94, 95, 96, 97, 98, 99
];

// medium placeholder array
const mediumQuestionsPlaceholderArray: number[] = [
    100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
    110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
    120, 121, 122, 123, 124, 125, 126, 127, 128, 129,
    130, 131, 132, 133, 134, 135, 136, 137, 138, 139,
    140, 141, 142, 143, 144, 145, 146, 147, 148, 149,
    150, 151, 152, 153, 154, 155, 156, 157, 158, 159,
    160, 161, 162, 163, 164, 165, 166, 167, 168, 169,
    170, 171, 172, 173, 174, 175, 176, 177, 178, 179,
    180, 181, 182, 183, 184, 185, 186, 187, 188, 189,
    190, 191, 192, 193, 194, 195, 196, 197, 198, 199
];

// hard placeholder array
const hardQuestionsPlaceholderArray: number[] = [
    200, 201, 202, 203, 204, 205, 206, 207, 208, 209,
    210, 211, 212, 213, 214, 215, 216, 217, 218, 219,
    220, 221, 222, 223, 224, 225, 226, 227, 228, 229,
    230, 231, 232, 233, 234, 235, 236, 237, 238, 239,
    240, 241, 242, 243, 244, 245, 246, 247, 248, 249,
    250, 251, 252, 253, 254, 255, 256, 257, 258, 259,
    260, 261, 262, 263, 264, 265, 266, 267, 268, 269,
    270, 271, 272, 273, 274, 275, 276, 277, 278, 279,
    280, 281, 282, 283, 284, 285, 286, 287, 288, 289,
    290, 291, 292, 293, 294, 295, 296, 297, 298, 299
];

/******************************************************************************
 * Define some types
 *****************************************************************************/

type Difficulty = "EASY" | "MEDIUM" | "HARD";
type Question = {
    difficulty:         Difficulty;
    questionStatement:  string;
}

let playerTier: number = 1

// missed questions
// to be imported later
let missedQuestions: number[] = [
    99, 32, 101, 2, 53
];

const n1: number = easyQuestionsPlaceholderArray.length;
const n2: number = mediumQuestionsPlaceholderArray.length;
const n3: number = hardQuestionsPlaceholderArray.length;
const mq: number = missedQuestions.length;

//const day: number = 4;  // later import from somewhere
const NUM_OF_QUESTIONS = 5;

//export questionsForTheDay: string[] = [];

//console.log(easyQuestionsPlaceholderArray);
//console.log(n1);
//console.log(mediumQuestionsPlaceholderArray);
//console.log(n2);
//console.log(hardQuestionsPlaceholderArray);
//console.log(n3);
//console.log(missedQuestions);

/******************************************************************************
 * Main Functions
 *****************************************************************************/

/**
 * TODO PLAN
 * ---------
 * So i know daily questions m = 10.
 * First, if I have some review, choose 4 from the queue and remove
 * Second, choose the rest from ..
 * Then,  if there is left over ..
 *
 * Im only worried that this isnt the correct implementation or the
 * implementation wouldnt be good enough since it may allow super
 * fast progression???
 *
 *    ====>    will have to later modify array for integration
 *
 */

type Score = {
    question: number;
    correct:  boolean;
};

// the scores for day d-2
export let recentScores: Score[] = [
    { question:   1, correct: true  },
    { question:   2, correct: true  },
    { question:   3, correct: true  },
    { question:   4, correct: true  },
    { question:   6, correct: true  },
    { question:   8, correct: false },
    { question:  14, correct: true  },
    { question:  12, correct: true  },
    { question:  15, correct: true  },
    { question:  23, correct: false }
];

// immediately from the previous day, since dailyQuestionPicker() is called at
// the beginning of each day
let playerData: Score[] =[
    { question:  31, correct: true  },
    { question:  92, correct: true  },
    { question:  61, correct: true  },
    { question: 102, correct: false },
    { question:  31, correct: true  },
    { question:  42, correct: true  },
    { question:  61, correct: true  },
    { question:  82, correct: false },
    { question:  21, correct: true  },
    { question:  82, correct: true  }
];

/**
 * Using the Fisher–Yates shuffle inspired by:
 *   https://stackoverflow.com/a/2450976
 * @param arr array that you want to shuffle
 * @return shuffled array
 */
function FY_shuffle(arr: number[]) {
    let currIndex = arr.length;
    while (currIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currIndex);
        --currIndex;
        [arr[currIndex], arr[randomIndex]] = [
            arr[randomIndex], arr[currIndex]
        ];
    }
    return arr;
}

/**
 * Normalize player's score between [0, 1]
 * @param recentScores array
 * @param playerData   array
 * @return number
 */
function normalize(
    recentScores: Score[], playerData: Score[]
): number {
    var arr = recentScores.concat(playerData);
    let totalSuccess: number = 0;
    for(let i = 0; i < arr.length; ++i) {
        if(arr[i].correct)
            ++totalSuccess;
    }
    // the check avoids dividing by zero
    return arr.length === 0 ? 0 : totalSuccess / arr.length;
}

/**
 * Daily Question Picker
 * Called at the beginning of every new day.
 * @param day the current day
 * @param playerData array of player scores from the previous day
 * @param recentScores array
 * @return array of the day's daily questions
 */
export function dailyQuestionPicker(
    day:          number,
    playerData:   Score[],
    recentScores: Score[]
): number[] {
    const result: number[] = [];
    // For all days after the first two, we have more data to decide what
    //  type of difficulty the player needs.
    if(recentScores.length >= 20) {
        let norm: number = normalize(recentScores, playerData);
        console.log(norm);
        // If the player has been doing very well!
        let a: number = 4;
        if(norm >= .9) {
            if(playerTier != 3) {
                ++playerTier;
            }
        }
        // If the player hasn't been doing well.'
        else if(norm < .5) {
            // give 5 review questions if there are
            // give easy questions in remaining slots
            a = 5;
        }
        /**
         *
         */
        if(missedQuestions.length > 0) {
            for(let i = 0; i < a && i < missedQuestions.length; ++i) {
                result.push(missedQuestions[i]);
                missedQuestions.shift();
            }
        }
        for(let j = result.length; j < 10; ++j) {
            const randomIndex = Math.floor(
                Math.random() * easyQuestionsPlaceholderArray.length
            );
            const[randElement] =
            easyQuestionsPlaceholderArray.splice(randomIndex, 1);
            result.push(randElement);
        }
    }
    // Only for the first two days due to insufficient player data.
    else {
        /**
         * == STEP 1 ==
         * If there are any questions in reviewQueue, add 40% to result[]
         * using a for-loop cuz why not
         * == STEP 2 ==
         * Choose the rest from easy queue.
         */
        if(missedQuestions.length > 0) {
            for(let i = 0; i < 4 && i < missedQuestions.length; ++i) {
                result.push(missedQuestions[i]);
                missedQuestions.shift();
            }
        }
        for(let j = result.length; j < 10; ++j) {
            const randomIndex = Math.floor(
                Math.random() * easyQuestionsPlaceholderArray.length
            );
            const[randElement] =
                    easyQuestionsPlaceholderArray.splice(randomIndex, 1);
            result.push(randElement);
        }
    }
    return FY_shuffle(result); // randomize elements then return
}

/**
 * Called here for testing
 */
const dailyQ: number[] = dailyQuestionPicker(
    2,
    playerData,
    recentScores
);

console.log(dailyQ);

