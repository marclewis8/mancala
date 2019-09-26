import { drawBoard, drawPlayerTurn } from "./board-script";
import { interaction } from "pixi.js";

export const numStones: number = 48;
export const numRows: number = 2;
export const numCols: number = 6;
export let model: number[][] = [];
export let p1Score: number = 0;
export let p2Score: number = 0;
let player: number = 1;

export let main = async () => {
    initModel();
    drawBoard();
};

export let initModel = () => {
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
        // we're on top row, which is player 2 moving left
        if (player === 1 || stonesFromBucket === 0) {
            model[row][col] = stonesFromBucket;
            return false;
        }
        let direction = -1;
        col += direction;
        for (let i = 0; i < stonesFromBucket; i++) {
            if (col === -1) {
                p2Score++;
                row++;
                direction *= -1;
                col += direction;
            } else if (col === numCols) {
                i--;
                row--;
                direction *= -1;
                col += direction;
            } else if (model[row][col] === 0 && i + 1 === stonesFromBucket && row === 0) {
                p2Score += 1 + model[1][col];
                model[1][col] = 0;
            } else {
                model[row][col]++;
                col += direction;
            }
        }
        player = 1;
        drawPlayerTurn(player);

    } else {
        // we're on the bottom, which is player 1 moving right

        if (player === 2 || stonesFromBucket === 0) {
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
        player = 2;
        drawPlayerTurn(player);
        console.log(model);
    }
    return true;
};

main();