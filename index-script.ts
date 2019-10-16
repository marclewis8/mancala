import { drawBoard, drawPlayerTurn } from "./board-script";
import { interaction } from "pixi.js";

export const numStones: number = 48;
export const numRows: number = 2;
export const numCols: number = 6;
export let model: number[][] = [];
export let p1Score: number = 0;
export let p0Score: number = 0;
export let winner: number = Number.NaN;
export let player: number = 1;

export let main = async () => {
    initModel();
    drawBoard();
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
    let stonesFromBucket = model[row][col];
    model[row][col] = 0;
    if (row === 0) {
        // we're on top row, which is player 0 moving left
        if (player === 1 || stonesFromBucket === 0) {
            model[row][col] = stonesFromBucket;
            return false;
        }
        let direction = -1;
        col += direction;
        for (let i = 0; i < stonesFromBucket; i++) {
            if (col === -1) {
                p0Score++;
                row++;
                direction *= -1;
                col += direction;
                if (i + 1 === stonesFromBucket) {
                    // Get to go again
                    player--;
                }
            } else if (col === numCols) {
                i--;
                row--;
                direction *= -1;
                col += direction;
            } else if (model[row][col] === 0 && i + 1 === stonesFromBucket && row === 0) {
                p0Score += 1 + model[1][col];
                model[1][col] = 0;
            } else {
                model[row][col]++;
                col += direction;
            }
        }
        player++;

    } else {
        // we're on the bottom, which is player 1 moving right

        if (player === 0 || stonesFromBucket === 0) {
            model[row][col] = stonesFromBucket;
            return false;
        }
        let direction = 1;
        col += direction;
        for (let i = 0; i < stonesFromBucket; i++) {
            if (col === numCols) {
                // We're at our bank
                p1Score++;
                row--;
                direction *= -1;
                col += direction;
                if (i + 1 === stonesFromBucket) {
                    player++;
                }

            } else if (col === -1) {
                i--;
                row++;
                direction = 1;
                col += direction;
            } else if (model[row][col] === 0 && i + 1 === stonesFromBucket && row === 1) {
                p1Score += 1 + model[0][col];
                model[0][col] = 0;
            } else {
                model[row][col]++;
                col += direction;
            }
        }
        player--;
    }
    checkIfGameOver();
    return true;
};

// TODO: make sure we don't need to return anything here
export let checkIfGameOver = () => {
    let sum1 = sumRow(1);
    let sum0 = sumRow(0);
    if (sum1 === 0) {
        handleGameOver(0, sum0, sum1);
    } else if (sum0 === 0) {
        handleGameOver(1, sum0, sum1);
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

export let handleGameOver = (rowToEmpty: number, sum0: number, sum1: number) => {
    p0Score += sum0;
    p1Score += sum1;
    clearRow(rowToEmpty);
    if (p1Score > p0Score) {
        winner = 1;
    } else if (p0Score > p1Score) {
        winner = 0;
    } else {
        winner = -1;
    }
};

main();