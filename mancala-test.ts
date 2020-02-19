import * as student from "./index-script";
import { expect, assert } from "chai";

let assertFunctionDefined = (name: string, input: {}) => {
    if (input === undefined) {
        throw new Error(
            "Expected the function `" + name +
            "` to be defined. Check spelling, case, and be sure you exported the function."
        );
    }
    expect(input).to.be.an("function");
};

let assertVariableDefined = (name: string, type: string, input: {}) => {
    if (input === undefined) {
        throw new Error(
            "Expect the variable `" + name +
            "` to be defined. Check spelling and case, and be sure you exported the variable."
        );
    }
    expect(input).to.be.a(type);
};

describe("0. Exports", () => {

    it("should have all the necessary exported variables and functions.", () => {
        assertVariableDefined("model", "array", student.model);
        assertVariableDefined("p1score", "number", student.p1Score);
        assertVariableDefined("p0score", "number", student.p0Score);
        assertVariableDefined("winner", "number", student.winner);
        assertVariableDefined("player", "number", student.player);
        assertFunctionDefined("setPlayer", student.setPlayer);
    });

});

describe("1. initModel", () => {
    it("Model should be initialized with all 4s", () => {
        assertFunctionDefined("initModel", student.initModel);
        assertVariableDefined("model", "array", student.model);
        expect(student.initModel()).to.equal(Ref.initModel());
        expect(student.model).to.deep.equal(Ref.model);
    });
});

describe("2. clearRow", () => {
    it("should set a row in the model to be all 0s", () => {
        assertFunctionDefined("clearRow", student.clearRow);
        assertVariableDefined("model", "array", student.model);
        Ref.initModel();
        let startingState = [
            [4, 4, 4, 4, 4, 4],
            [4, 4, 4, 4, 4, 4]
        ];
        setModel(student.model, startingState);
        Ref.clearRow(0);
        student.clearRow(0);
        expect(student.model).deep.equal(Ref.model);
        Ref.clearRow(1);
        student.clearRow(1);
        expect(student.model).deep.equal(Ref.model);
    });
});

describe("3. sumRow", () => {
    it("should take the sum of a row in the model. Note that we are testing randomly generated numbers here", () => {
        assertFunctionDefined("sumRow", student.sumRow);
        assertVariableDefined("model", "array", student.model);
        let randomModel = genRandomModel(2, 6);
        setModel(student.model, randomModel);
        setModel(Ref.model, randomModel);
        expect(student.sumRow(0)).to.deep.equal(Ref.sumRow(0));
        expect(student.sumRow(1)).to.deep.equal(Ref.sumRow(1));
    });
});

describe("4. onclick for player 0", () => {

    it("should not move stones when player 0 clicks on a bucket in player 1's row", () => {
        student.setPlayer(0);
        Ref.player = 0;
        assertVariableDefined("model", "array", student.model);
        assertFunctionDefined("onClick", student.onClick);
        assert(student.player === 0, "Incorrect player turn");
        initStudentModel();
        Ref.initModel();

        // player 0 clicks on bucket in row 1
        expect(student.onClick(1, 1)).to.equal(Ref.onClick(1, 1)); // should return false
        expect(student.model).to.deep.equal(Ref.model); // should be no internal board change
    });

    it("should not move stones when player 0 clicks on an empty bucket", () => {
        student.setPlayer(0);
        Ref.player = 0;
        assertVariableDefined("model", "array", student.model);
        assertFunctionDefined("onClick", student.onClick);
        assert(student.player === 0, "Incorrect player turn");

        initStudentModel();
        Ref.initModel();

        student.onClick(0, 5); // create empty bucket on player 0's row
        Ref.onClick(0, 5);

        student.setPlayer(0);
        Ref.player = 0;
        expect(student.onClick(0, 5)).to.equal(Ref.onClick(0, 5));
        expect(student.model).to.deep.equal(Ref.model);
    });

    it("should add a stone to player 0's store when the loop reaches the left edge", () => {
        student.setPlayer(0);
        Ref.player = 0;
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("p0Score", "number", student.p0Score);
        assertVariableDefined("model", "array", student.model);
        assert(student.player === 0, "Incorrect player turn");

        initStudentModel();
        Ref.initModel();

        expect(student.onClick(0, 1)).to.equal(Ref.onClick(0, 1)); // should be a successful move
        student.setPlayer(0);
        Ref.player = 0;
        expect(student.p0Score).to.equal(Ref.p0Score); // should deposit one in p0score
        expect(student.model).to.deep.equal(Ref.model);
    });

    it("should skip over player 1's store when the loop reaches the right edge", () => {
        student.setPlayer(0);
        Ref.player = 0;
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("p1score", "number", student.p1Score);
        assertVariableDefined("model", "array", student.model);
        assert(student.player === 0, "Incorrect player turn");

        let startingState = [
            [10, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1]
        ];

        setModel(student.model, startingState);
        setModel(Ref.model, startingState);

        student.onClick(0, 0);
        Ref.onClick(0, 0);
        expect(student.p1Score).to.equal(Ref.p1Score); // score shouldn't change after click
        expect(student.model).to.deep.equal(Ref.model);
    });

    it("should have player 0 go again when the last stone deposited went into player 0's store", () => {
        student.setPlayer(0);
        Ref.player = 0;
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("player", "number", student.player);
        assert(student.player === 0, "Incorrect player turn");

        initStudentModel();
        Ref.initModel();

        student.onClick(0, 3);
        Ref.onClick(0, 3);
        expect(student.player).to.equal(Ref.player);
    });

    it("should steal from player 1 when last stone is dropped in empty bucket", () => {
        student.setPlayer(0);
        Ref.player = 0;
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("player", "number", student.player);
        assertVariableDefined("model", "array", student.model);
        assert(student.player === 0, "Incorrect player turn");

        Ref.initModel();
        initStudentModel();
        let startingState = [
            [6, 8, 8, 1, 0, 1],
            [0, 6, 5, 5, 5, 0]
        ];
        setModel(student.model, startingState);
        setModel(Ref.model, startingState);
        student.onClick(0, 5);
        Ref.onClick(0, 5);
        expect(student.p0Score).to.equal(Ref.p0Score);
        expect(student.model).to.deep.equal(Ref.model);
    });

    it("should correctly move stones when none of the edge cases are encountered", () => {
        student.setPlayer(0);
        Ref.player = 0;
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("model", "array", student.model);
        assert(student.player === 0, "Incorrect player turn");

        let startingState = [
            [5, 5, 0, 4, 5, 5],
            [5, 4, 4, 0, 5, 5]
        ];

        setModel(student.model, startingState);
        setModel(Ref.model, startingState);

        student.onClick(0, 5);
        Ref.onClick(0, 5);
        expect(student.model).to.deep.equal(Ref.model);
    });

});


describe("5. onclick for player 1", () => {

    it("should not move stones when player 1 clicks on a bucket in player 0's row", () => {
        student.setPlayer(1);
        Ref.player = 1;
        assertVariableDefined("model", "array", student.model);
        assertFunctionDefined("onClick", student.onClick);
        student.onClick(0, 0);
        Ref.onClick(0, 0);
        assert(student.player === 1, "Incorrect player turn");
        initStudentModel();
        Ref.initModel();

        // player 1 clicks on bucket in row 0
        expect(student.onClick(0, 1)).to.equal(Ref.onClick(0, 1)); // should return false
        expect(student.model).to.deep.equal(Ref.model); // should be no internal board change
    });

    it("should not move stones when player 1 clicks on an empty bucket", () => {
        student.setPlayer(1);
        Ref.player = 1;
        assertVariableDefined("model", "array", student.model);
        assertFunctionDefined("onClick", student.onClick);
        assertFunctionDefined("initModel", student.initModel);
        assert(student.player === 1, "Incorrect player turn");

        initStudentModel();
        Ref.initModel();

        student.onClick(1, 0); // create empty bucket on player 1's row
        Ref.onClick(1, 0);

        student.setPlayer(1);
        Ref.player = 1;

        expect(student.onClick(1, 0)).to.equal(Ref.onClick(1, 0)); // both should be false, no state change
        expect(student.model).to.deep.equal(Ref.model);
    });

    it("should add a stone to player 1's store when the loop reaches the right edge", () => {
        student.setPlayer(1);
        Ref.player = 1;
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("p1Score", "number", student.p1Score);
        assertVariableDefined("model", "array", student.model);
        assertFunctionDefined("initModel", student.initModel);
        assert(student.player === 1, "Incorrect player turn");

        initStudentModel();
        Ref.initModel();

        expect(student.onClick(1, 3)).to.equal(Ref.onClick(1, 3)); // should be a successful move
        expect(student.p1Score).to.equal(Ref.p1Score); // should deposit one in p1score
        expect(student.model).to.deep.equal(Ref.model);
    });

    it("should skip over player 0's store when the loop reaches the left edge", () => {
        student.setPlayer(1);
        Ref.player = 1;
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("p1score", "number", student.p1Score);
        assertVariableDefined("model", "array", student.model);
        assert(student.player === 1, "Incorrect player turn");

        let startingState = [
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 10]
        ];

        setModel(student.model, startingState);
        setModel(Ref.model, startingState);

        student.onClick(1, 5);
        Ref.onClick(1, 5);
        expect(student.p1Score).to.equal(Ref.p1Score); // score shouldn't change after click
        expect(student.model).to.deep.equal(Ref.model);
    });

    it("should have player 1 go again when the last stone deposited went into player 1's store", () => {
        student.setPlayer(1);
        Ref.player = 1;
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("player", "number", student.player);
        assertFunctionDefined("initModel", student.initModel);
        assert(student.player === 1, "Incorrect player turn");

        initStudentModel();
        Ref.initModel();

        student.onClick(1, 2);
        Ref.onClick(1, 2);
        expect(student.player).to.equal(Ref.player);
    });

    it("should steal from player 0 when last stone is dropped in empty bucket", () => {
        student.setPlayer(1);
        Ref.player = 1;
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("player", "number", student.player);
        assertVariableDefined("model", "array", student.model);
        assertFunctionDefined("initModel", student.initModel);
        assert(student.player === 1, "Incorrect player turn");

        Ref.initModel();
        initStudentModel();
        let startingState = [
            [1, 5, 1, 1, 1, 1],
            [1, 0, 1, 1, 1, 1]
        ];
        setModel(student.model, startingState);
        setModel(Ref.model, startingState);
        student.onClick(1, 0);
        Ref.onClick(1, 0);
        expect(student.p1Score).to.equal(Ref.p1Score);
        expect(student.model).to.deep.equal(Ref.model);
    });

    it("should correctly move stones when none of the edge cases are encountered", () => {
        student.setPlayer(1);
        Ref.player = 1;
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("model", "array", student.model);
        assert(student.player === 1, "Incorrect player turn");

        let startingState = [
            [5, 5, 0, 4, 5, 5],
            [5, 4, 4, 0, 5, 5]
        ];

        setModel(student.model, startingState);
        setModel(Ref.model, startingState);

        student.onClick(1, 1);
        Ref.onClick(1, 1);
        expect(student.model).to.deep.equal(Ref.model);
    });
});

describe("6. checkIfGameOver", () => {
    it("should correctly determine when there is no winner", () => {
        assertFunctionDefined("checkIfGameOver", student.checkIfGameOver);
        assertVariableDefined("winner", "number", student.winner);
        let startingState = [
            [7, 19, 9, 8, 4, 3],
            [32, 3, 76, 23, 9, 2]
        ];
        setModel(student.model, startingState);
        setModel(Ref.model, startingState);
        student.checkIfGameOver();
        Ref.checkIfGameOver();
        expect(Number.isNaN(student.winner)).to.equal(Number.isNaN(Ref.winner));
    });
    it("should correctly determine when player 0 wins", () => {
        assertFunctionDefined("checkIfGameOver", student.checkIfGameOver);
        assertVariableDefined("winner", "number", student.winner);
        let startingState = [
            [0, 0, 10000, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]
        ];
        setModel(student.model, startingState);
        setModel(Ref.model, startingState);
        student.checkIfGameOver();
        Ref.checkIfGameOver();
        expect(student.winner).to.equal(Ref.winner);
    });
    it("should correctly determine when player 1 wins", () => {
        assertFunctionDefined("checkIfGameOver", student.checkIfGameOver);
        assertVariableDefined("winner", "number", student.winner);
        let startingState = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 20000, 0, 0, 0]
        ];
        setModel(student.model, startingState);
        setModel(Ref.model, startingState);
        student.checkIfGameOver();
        Ref.checkIfGameOver();
    });
    it("should correctly determine when there is a tie", () => {
        assertFunctionDefined("checkIfGameOver", student.checkIfGameOver);
        assertVariableDefined("winner", "number", student.winner);
        let startingState = [
            [0, 0, 10000, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]
        ];
        setModel(student.model, startingState);
        setModel(Ref.model, startingState);
        student.checkIfGameOver();
        Ref.checkIfGameOver();
        expect(student.winner).to.equal(Ref.winner);
    });
});

describe("7. student model", () => {
    it("should be the same as the grader's model over the course of an entire game", () => {
        // Include all different test cases
        simulateGame();
    });
});

let testClick = (row: number, col: number): void => {
    let startingState = copyArr(student.model);
    Ref.onClick(row, col);
    student.onClick(row, col);

    expect(student.model).to.deep.equal(Ref.model, generateErrorMessage("model", row, col, startingState));
    expect(student.player).to.equal(Ref.player, generateErrorMessage("player", row, col, startingState));
    expect(student.p0Score).to.equal(Ref.p0Score, generateErrorMessage("p0Score", row, col, startingState));
    expect(student.p1Score).to.equal(Ref.p1Score, generateErrorMessage("p1Score", row, col, startingState));
};

let generateErrorMessage = (sourceOfError: string, row: number, col: number, model: number[][]): string => {
    return `Your ${sourceOfError} is incorrect after the following row and column are clicked on with the given starting state.\nRow: ${row}\nCol: ${col}\nStarting state:\n${model[0]}\n${model[1]}\n`;
};

let simulateGame = (): void => {
    student.setPlayer(0);
    Ref.player = 0;
    student.initModel();
    Ref.initModel();
    // Test goAgain p0
    testClick(0, 3);
    // Regular movement p0
    testClick(0, 5);
    // Test goAgain p1
    testClick(1, 2);
    // Regular movement p1
    testClick(1, 1);
    // p0Score and regular movement of p0 on row 1
    testClick(0, 2);
    // Regular movement p1
    testClick(1, 0);
    // p0 steals from p1
    testClick(0, 3);
    // p1Score and regular movement of p1 on row 0
    testClick(1, 3);
    // p0Score and not stealing from itself
    testClick(0, 4);
    // p1 steal from p0
    testClick(1, 1);
    // p1 steal from p0
    testClick(1, 1);
    // p0 regular movement
    testClick(0, 2);
    // p1 steal nothing
    testClick(1, 2);
    // p0 steal 
    testClick(0, 5);
    // p1 steal 
    testClick(1, 0);
    // p0 wrap around and steal
    testClick(0, 0);
    // End of game 0
    student.setPlayer(1);
    Ref.player = 1;
    let game1StartState = [
        [5, 14, 4, 4, 4, 4],
        [0, 3, 2, 2, 14, 8]
    ];
    setModel(student.model, game1StartState);
    setModel(Ref.model, game1StartState);
    // p1 wrap around and steal
    testClick(1, 5);
    // p0 goes all the way around and triggers go again
    testClick(0, 1);
    // p1 goes all the way around and triggers go again
    testClick(1, 4);
};

let copyArr = <T>(input: T[][]): T[][] => {
    let output: T[][] = [];
    for (let i = 0; i < input.length; i++) {
        output[i] = input[i].slice();
    }
    return output;
};

let initStudentModel = () => {
    setModel(student.model, [
        [4, 4, 4, 4, 4, 4],
        [4, 4, 4, 4, 4, 4]
    ]);
};

export module Ref {
    export const numStones: number = 48;
    export const numRows: number = 2;
    export const numCols: number = 6;
    export let model: number[][] = [];
    export let p1Score: number = 0;
    export let p0Score: number = 0;
    export let winner: number = Number.NaN;
    export let player: number = 0;

    export let main = async () => {
        initModel();
        // drawBoard();
    };

    export let initModel = (): void => {
        for (let row = 0; row < numRows; row++) {
            model[row] = [];
            for (let col = 0; col < numCols; col++) {
                model[row][col] = 4;
            }
        }
    };

    export let onClick = (row: number, col: number): boolean => {
        let stonesInHand = model[row][col];
        model[row][col] = 0;
        if (row === 0) {
            // we're on top row, which is player 0 moving left
            if (player === 1 || stonesInHand === 0) {
                model[row][col] = stonesInHand;
                return false;
            }
            let direction = -1;
            let goAgain = false;
            while (stonesInHand > 0) {
                col += direction;
                if (col === -1) {
                    // should add a stone to player 0's store when the loop reaches the left edge
                    p0Score++;
                    row++;
                    direction *= -1;
                    if (stonesInHand === 1) {
                        // should have player 0 go again when the last stone deposited went into player 0's store
                        goAgain = true;
                    }
                    stonesInHand--;
                } else if (col === numCols) {
                    // should skip over player 1's store when the loop reaches the right edge
                    row--;
                    direction *= -1;
                } else if (model[row][col] === 0 && stonesInHand === 1 && row === 0) {
                    // should steal from player 1 when last stone is dropped in empty bucket
                    p0Score += 1 + model[1][col];
                    model[1][col] = 0;
                    stonesInHand--;
                } else {
                    model[row][col]++;
                    stonesInHand--;
                }
            }
            if (!goAgain) {
                player = 1;
            }
        } else {
            // we're on the bottom, which is player 1 moving right

            if (player === 0 || stonesInHand === 0) {
                model[row][col] = stonesInHand;
                return false;
            }
            let goAgain = false;
            let direction = 1;
            while (stonesInHand > 0) {
                col += direction;
                if (col === numCols) {
                    // We're at our bank
                    p1Score++;
                    row--;
                    direction *= -1;
                    if (stonesInHand === 1) {
                        goAgain = true;
                    }
                    stonesInHand--;
                } else if (col === -1) {
                    row++;
                    direction = 1;
                } else if (model[row][col] === 0 && stonesInHand === 1 && row === 1) {
                    p1Score += 1 + model[0][col];
                    model[0][col] = 0;
                    stonesInHand--;
                } else {
                    model[row][col]++;
                    stonesInHand--;
                }
            }
            if (!goAgain) {
                player = 0;
            }
        }
        checkIfGameOver();
        return true;
    };

    // TODO: make sure we don't need to return anything here
    export let checkIfGameOver = () => {
        let sum1 = sumRow(1);
        let sum0 = sumRow(0);
        if (sum0 === 0 || sum1 === 0) {
            clearRow(0);
            clearRow(1);
            p0Score += sum0;
            p1Score += sum1;
            if (p1Score > p0Score) {
                winner = 1;
            } else if (p0Score > p1Score) {
                winner = 0;
            } else {
                winner = -1;
            }
        }
    };

    export let clearRow = (row: number) => {
        for (let col = 0; col < model[row].length; col++) {
            model[row][col] = 0;
        }
    };

    export let sumRow = (row: number) => {
        let count = 0;
        for (let col = 0; col < numCols; col++) {
            count += model[row][col];
        }
        return count;
    };

}

// Test helpers
let setModel = (destModel: number[][], sourceModel: number[][]): void => {
    for (let row = 0; row < 2; row++) {
        destModel[row] = [];
        for (let col = 0; col < 6; col++) {
            destModel[row][col] = sourceModel[row][col];
        }
    }
};

let genRandomModel = (numRows: number, numCols: number): number[][] => {
    let output: number[][] = [];
    for (let row = 0; row < numRows; row++) {
        output[row] = [];
        for (let col = 0; col < numCols; col++) {
            output[row][col] = Math.floor(Math.random() * 100);
        }
    }
    return output;
};