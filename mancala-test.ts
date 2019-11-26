import * as student from "./student-script";
import { expect, assert } from "chai";
import { assertFunction } from "babel-types";
// import { player } from "./index-script";




let assertFunctionDefined = (name: string, input: {}) => {
    if (input === undefined) {
        throw new Error(
            "Expected the function `" + name +
            "` to be defined. Check spelling, case, and be sure you exported the function."
        );
    }
    expect(input).to.be.an("function");
};

let assertVariableDefined = (name: string, input: {}) => {
    if (input === undefined) {
        throw new Error(
            "Expect the variable `" + name +
            "` to be defined. Check spelling and case, and be sure you exported the variable."
        );
    }
    expect(input).to.be.an("variable");
};

describe("0. Exports", () => {

    it("should have all the necessary exported variables and functions.", () => {

        assertVariableDefined("player", student.player);

    });

});

describe("1. initModel", () => {
    it("Model should be initialized with all 4s", () => {
        assertFunctionDefined("initModel", student.initModel);
        Ref.initModel();
        student.initModel();
        expect(student.model).to.deep.equal(Ref.model);
    });
});

describe("2. clearRow", () => {
    it("should set a row in the model to be all 0s", () => {
        assertFunctionDefined("clearRow", student.clearRow);
        Ref.initModel();
        Ref.clearRow(0);
        Ref.clearRow(1);
        student.clearRow(0);
        student.clearRow(1);
        expect(student.model).deep.equal(Ref.model);

    });
});

describe("3. sumRow", () => {
    it("should take the sum of a row in the model. Note that we are testing randomly generated numbers here", () => {
        assertFunctionDefined("sumRow", student.sumRow);
        let randomModel = genRandomModel(2, 6);
        if (!setModel(student.model, randomModel)) {
            assert(false, "Incorrect number of rows or columns in model");
        }
        setModel(Ref.model, randomModel);
        expect(student.sumRow(0)).to.deep.equal(Ref.sumRow(0));
        expect(student.sumRow(1)).to.deep.equal(Ref.sumRow(1));
    });
});

describe("4. onclick for player 0", () => {

    it("should not move stones when player 0 clicks on a bucket in player 1's row", () => {

        assertFunctionDefined("initModel", student.initModel);
        assertFunctionDefined("onClick", student.onClick);

        student.initModel();

        // player 0 clicks on bucket in row 1
        let copy = copyArr(student.model);
        let result = student.onClick(1, 1);

        expect(result).to.equal(false); // should return false
        expect(student.model).to.deep.equal(copy); // should be no internal board change

    });

    it("should not move stones when player 0 clicks on an empty bucket", () => {

        assertFunctionDefined("initModel", student.initModel);
        assertFunctionDefined("onClick", student.onClick);

        student.initModel();

        student.onClick(0, 1); // create empty bucket on player 0's row
        student.onClick(1, 3); // take a turn for player 1

        let copy = copyArr(student.model);
        let result = student.onClick(0, 1);

        expect(result).to.equal(false);
        expect(student.model).to.deep.equal(copy);

    });

    it("should add a stone to player 0's store when the loop reaches the left edge", () => {

        assertFunctionDefined("initModel", student.initModel);
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("p0Score", student.p0Score);

        student.initModel();

        let result = student.onClick(0, 1);
        expect(result).to.equal(true); // should be a successful move
        expect(student.p0Score).to.equal(1); // should deposit one in p0score

    });

    it("should skip over player 1's store when the loop reaches the right edge", () => {

        assertFunctionDefined("initModel", student.initModel);
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("p1score", student.p1Score);

        let example = [[10, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1]];
        setModel(student.model, example);

        let score = student.p1Score;
        student.onClick(0, 0);
        expect(student.p1Score).to.equal(score); // score shouldn't change after click
    });

    it("should have player 0 go again when the last stone deposited went into player 0's store", () => {

        assertFunctionDefined("initModel", student.initModel);
        assertFunctionDefined("onClick", student.onClick);
        assertVariableDefined("player", student.player);

        student.initModel();

        let playerBeforeClick = student.player;
        student.onClick(0, 3);
        expect(student.player).to.equal(playerBeforeClick);
    });

});

describe("0. copyArr", () => {
    it("Simple copy", () => {
        let og = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];
        let copy = copyArr(og);
        expect(copy).to.deep.equal(og);
    });

    it("should also work after model has been changed", () => {
        Ref.initModel();
        let copy = copyArr(Ref.model);
        Ref.clearRow(0);
        expect(Ref.model).deep.equal([
            [0, 0, 0, 0, 0, 0],
            [4, 4, 4, 4, 4, 4]
        ]);
        expect(copy).deep.equal([[4, 4, 4, 4, 4, 4], [4, 4, 4, 4, 4, 4]]);
        Ref.model = copy;
        for (let i = 0; i < Ref.model.length; ++i) {
            expect(Ref.model[i]).eql(copy[i]);
        }
        expect(Ref.model).deep.equal(copy);
    });
});


let copyArr = <T>(input: T[][]): T[][] => {
    let output: T[][] = [];
    for (let i = 0; i < input.length; i++) {
        output[i] = input[i].slice();
    }
    return output;
};

module Ref {
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
                    p0Score++;
                    row++;
                    direction *= -1;
                    if (stonesInHand === 1) {
                        // Get to go again
                        goAgain = true;
                    }
                    stonesInHand--;
                } else if (col === numCols) {
                    row--;
                    direction *= -1;
                } else if (model[row][col] === 0 && stonesInHand === 1 && row === 0) {
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

    export let handleGameOver = (sum0: number, sum1: number) => {
        p0Score += sum0;
        p1Score += sum1;
        if (p1Score > p0Score) {
            winner = 1;
        } else if (p0Score > p1Score) {
            winner = 0;
        } else {
            winner = -1;
        }
    };

}

// Test helpers
let setModel = (destModel: number[][], sourceModel: number[][]): boolean => {
    if (destModel.length !== 2 || destModel[0].length !== 6) {
        return false;
    }
    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 6; col++) {
            destModel[row][col] = sourceModel[row][col];
        }
    }
    return true;
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