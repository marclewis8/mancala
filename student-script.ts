import { drawBoard, drawPlayerTurn } from "./board-script";




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
                // model[row][col]++;
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
    console.log("handle game over got called");
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