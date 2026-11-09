/**
 * So, ill import the arrays gerrel will make
 * then ill
 */

/**
 * What i need to know:
 *  How many questions should we have in a day?
 */

// select questions for each day, prioritize prviously missed questions, avoid
// repeated questions within a day, and mix new questions with review questions

/**
 * Review scheduling: When should a question the player has seen come back?
 * Set selection:     Given what’s due, which `m` questions should appear
 *  today?
 */

// easy
const placeholder1: string[] = ["1","2","3","4","6","8","0","10",
        "11","12","13","14","15","17"];
// medium
const placeholder2: string[] = ["222","333","444","555","666","777","888",
        "999", "21","41","56","5","94","19"];

// hard
const placeholder3: string[] = ["100","101","102","103","104","105","106",
        "107", "108","109","110","111","112","113"];

// missed questions
// to be imported later
const missedQuestions: string[] = [];

const n1: number = placeholder1.length;
const n2: number = placeholder2.length;
const n3: number = placeholder3.length;
const mq: number = missedQuestions.length;

const day: number = 4;  // later import from somewhere
const NUM_OF_QUESTIONS = 5;

//export questionsForTheDay: string[] = [];

/**
 * Runs at the start of every day and stores the result in questionsForTheDay[]
 */
function questionPicker(/**/): string[] {
    if(day < 0) {
        console.log("day is negative" + day);
        return;
    }

    const questionsForTheDay: string[] = [];

    /**
     * For easy days, choose all easy questions
     */
    if(day < 5) {
        for(let i = 0; i < NUM_OF_QUESTIONS; ++i) {
            // pick a random question
            // without duplicates
            // so i think ill jus create temp copies
            //temp = placeholder1

            const random: number = 32;
            questionsForTheDay.push(placeholder1[random % n1]);
        }
        /**
         * Then, three questions from missedQuestions[] will be
         *  pushed to questionsForTheDay[] as well.
         */
        // code for that

        /**
         * OR
         *          Do I want to make it so there's a chance i choose a
         *          question from either question back or missedQuestions
         *          maybe like a 50/50, or 40/60 ?
         *
         *          I can then randomize the positions
         */

        console.log(questionsForTheDay);
    }
    /**
     * For easy-to-medium days, choose 3 easy, 2 medium questions
     */
    else if(day < 10) {
        for(let i = 0; i < NUM_OF_QUESTIONS; ++i) {
            // pick a random question
            // without duplicates
        }
    }
    /**
     * For medium days, choose all medium questions
     */
    else if(day < 15) {
        for(let i = 0; i < NUM_OF_QUESTIONS; ++i) {
            // pick a random question
            // without duplicates
        }
    }
    /**
     * For medium-to-hard days, choose 3 medium, 2 hard questions
     */
    else if(day < 25) {
        for(let i = 0; i < NUM_OF_QUESTIONS; ++i) {
            // pick a random question
            // without duplicates
        }
    }
    /**
     * For hard days, choose all hard questions
     */
    else if(day < 99) {
        for(let i = 0; i < NUM_OF_QUESTIONS; ++i) {
            // pick a random question
            // without duplicates
        }
    }

    return questionsForTheDay;
    //++day;
}

console.log(placeholder1);
console.log(n1);
console.log(placeholder2);
console.log(n2);
console.log(placeholder3);
console.log(n3);

questionPicker();
