import { describe, expect, it} from "vitest";
import {GameFlow} from "../../game/GameFlow";
import { questions, type Question } from "../../customer/QuestionBank";

const testQuestions: Question[] = [
    { id: "q01", difficulty: "easy", slices: 2, showDecimal: true,
      toppings: [{ toppingName: "pepperoni", numerator: 1, denominator: 2 }] },

    { id: "q02", difficulty: "easy", slices: 2, showDecimal: false,
      toppings: [{ toppingName: "olives", numerator: 1, denominator: 2 }] },

    { id: "q03", difficulty: "easy", slices: 3, showDecimal: false,
      toppings: [{ toppingName: "basil", numerator: 1, denominator: 3 }] },

    { id: "q04", difficulty: "easy", slices: 3, showDecimal: false,
      toppings: [{ toppingName: "pepperoni", numerator: 2, denominator: 3 }] },

    { id: "q05", difficulty: "easy", slices: 4, showDecimal: false,
      toppings: [{ toppingName: "onions", numerator: 1, denominator: 4 }] },

    { id: "q06", difficulty: "easy", slices: 4, showDecimal: false,
      toppings: [{ toppingName: "olives", numerator: 3, denominator: 4 }] },
];

describe("GameFlow", () => {

    // if validator says that the pizza is right, the point goes up by 1
    it("increments the score for a correct pizza order", () => {
        const game = new GameFlow(questions);
        game.serve(true);
        expect(game.score).toBe(1)
    });

    // if validator says that the pizza is wrong, no points
    it("does not increment the score for a wrong pizza order", () => {
        const game = new GameFlow(questions);
        game.serve(false);
        expect(game.score).toBe(0)
    });

    it("allows unlimited attempts on the same order until it is correct", () => {
        const game = new GameFlow(testQuestions);

        game.serve(false);
        game.retry();
        game.serve(false);
        game.retry();
        game.serve(true);

        expect(game.score).toBe(1);
        expect(game.currentOrder()).toBe(testQuestions[0]);
        expect(game.getMissedQuestionsID()).toEqual(["q01"]);
    });

    //player presses continue, and second order in the list is now the current order
    it("moves on to the next customers order after player clicks continue", () => {
        const game = new GameFlow(questions);
        game.serve(true);
        game.next();
        expect(game.currentOrder()).toBe(questions[1]);
    });

    // the loop serves every customer correctly and presses continue
    // when there are no customers left, game is over
    // score is the number of orders that are correct
    it("game ends after the last customer's order is complete", () => {
        const game = new GameFlow(questions);
        for (let i = 0; i < questions.length; i++){
            game.serve(true)
            game.next();
        }
        expect(game.isFinished()).toBe(true);
        expect(game.currentOrder()).toBeNull();
        expect(game.score).toBe(questions.length);
        
    });

    // if the player presses play again the score resets and the game goes back to the first customer
    it("restarting the game resets the game and goes back to the first customer with a score of 0", () => {
        const game = new GameFlow(questions);
        game.serve(true)
        game.next();
        game.restart();
       
        expect(game.score).toBe(0);
        expect(game.currentOrder()).toBe(questions[0]);
    });

    // Checking to see that getting correct answer = no questions in the arr 
    it("doesnt add to the wrong question tracker if the pizza is correct", () => {
        const game = new GameFlow(testQuestions)

        game.serve(true); 
        game.next()
        game.serve(true)

        expect(game.getMissedQuestionsID().length).toEqual(0)
        const wrongQArr: Question[] = game.getMissedQuestions()
        expect(wrongQArr).toEqual([]);
    });

    it("adds the question id that was wrong to the wrong question tracker", () =>{
        //Testing: first question wrong, second right 
        const game = new GameFlow(testQuestions); 

        game.serve(false); 
        game.next(); 
        game.serve(true); 

        expect(game.getMissedQuestionsID()).toEqual(["q01"]);

        const wrongQArr: Question[] = game.getMissedQuestions()
        expect(wrongQArr).toEqual([testQuestions[0]]);


        const game2 = new GameFlow(testQuestions); 
        game2.serve(true); 
        game2.next(); 
        game2.serve(false); 

        expect(game2.getMissedQuestionsID()).toEqual(["q02"]);
        const wrongQArr2: Question[] = game2.getMissedQuestions()
        expect(wrongQArr2).toEqual([testQuestions[1]]);
    });


    // All q wrong, need to add all those q to the arr test
    it('adds all question id that was wrong to the wrong question tracker', () => {
        const game = new GameFlow(testQuestions); 

        for (let i = 0; i < testQuestions.length; i++) {
            game.serve(false);
            game.next();
        }

        expect(game.getMissedQuestionsID()).toEqual(["q01", "q02", 'q03', 'q04', 'q05', 'q06']);
        expect(game.getMissedQuestions()).toEqual(testQuestions); 
    });

    //Testing scoring functionality (all correct = 6 points)
    it ('adds 1 to the score if the user gets the order correct', () => {
        const game = new GameFlow(testQuestions); 

        let scoreTrack = 0;
        for (let i = 0; i < testQuestions.length; i++) {
            game.serve(true);
            scoreTrack ++; 
            expect(game.score).toBe(scoreTrack);
            game.next();
        }

        //end should be 6 
        expect(game.score).toBe(6);
    })

    it ('does not add to the score if the user gets the order incorrect', () => {
        const game = new GameFlow(testQuestions); 

        let scoreTrack = 0;
        for (let i = 0; i < testQuestions.length; i++) {
            game.serve(false);
            expect(game.score).toBe(0);
            game.next();
        }

        //end should be 0 in end 
        expect(game.score).toBe(0);
    })

    //Comprehensive test (score tracker + wrong q tracker)
    it ('does adds to the score if the user gets the order correct', () => {
        const game = new GameFlow(testQuestions); 
        

        //q1
        game.serve(true);
        expect(game.score).toBe(1);
        game.next();

        //q2
        game.serve(false)
        expect(game.getMissedQuestionsID()).toEqual(["q02"]);
        expect(game.score).toBe(1);
        game.next();
        
        //q3
        game.serve(false);
        expect(game.getMissedQuestionsID()).toEqual(["q02", 'q03']);
        expect(game.score).toBe(1);
        game.next();

        //q4
        game.serve(true);
        expect(game.getMissedQuestionsID()).toEqual(["q02", 'q03']);
        expect(game.score).toBe(2);
        game.next();

        //q5    
        game.serve(true);
        expect(game.getMissedQuestionsID()).toEqual(["q02", 'q03']);
        expect(game.score).toBe(3);
        game.next();


        //q6
        game.serve(false);
        expect(game.getMissedQuestionsID()).toEqual(["q02", 'q03', 'q06']);
        expect(game.score).toBe(3);
        game.next();

        //Checking the arr 
        const wrongQArr: Question[] = game.getMissedQuestions();
        expect(wrongQArr).toEqual([testQuestions[1], testQuestions[2], testQuestions[5]]);
    })

    it("charges 100 once for a wrong try and still allows a correct retry", () => {
        const game = new GameFlow(testQuestions);

        game.noteWrong();
        game.noteWrong();

        expect(game.score).toBe(0);
        expect(game.earnings).toBe(-100);
        expect(game.getMissedQuestionsID()).toEqual(["q01"]);
        expect(game.wait).toBe(true);

        game.serve(true);

        expect(game.score).toBe(1);
        expect(game.earnings).toBe(0);
        expect(game.getMissedQuestionsID()).toEqual(["q01"]);
        expect(game.wait).toBe(false);
    });

    it("does not charge again after the customer has already been served", () => {
        const game = new GameFlow(testQuestions);

        game.serve(true);
        game.noteWrong();

        expect(game.score).toBe(1);
        expect(game.earnings).toBe(100);
        expect(game.getMissedQuestionsID()).toEqual([]);
    });

    it("counts a timeout as a miss without changing the cash", () => {
        const game = new GameFlow(testQuestions);
        game.earnings = 300;

        game.timeUp();
        game.serve(true);

        expect(game.score).toBe(0);
        expect(game.earnings).toBe(300);
        expect(game.wait).toBe(false);
        expect(game.getMissedQuestionsID()).toEqual(["q01"]);
    });

    it("starts the next day at score 0 and keeps the cash", () => {
        const day = new GameFlow(testQuestions);
        day.serve(true);
        day.next();
        day.serve(true);

        const nextDay = new GameFlow(testQuestions);
        nextDay.earnings = day.earnings;

        expect(day.score).toBe(2);
        expect(day.earnings).toBe(200);
        expect(nextDay.score).toBe(0);
        expect(nextDay.earnings).toBe(200);
        expect(nextDay.currentOrder()).toBe(testQuestions[0]);
    });

});