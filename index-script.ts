import { drawBoard, getIndexFromClick } from "./board-script";
import { interaction } from "pixi.js";

export const numStones: number = 48;
export const numRows: number = 2;
export const numCols: number = 6;
export let model: number[][] = [];

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

export let onClick = (event: interaction.InteractionEvent): void => {
    let stringCoords = getIndexFromClick(event);
    let coords = stringCoords.split(",");
    let [x, y] = coords.map(x => parseInt(x, 10));
    console.log(`x: ${x}, y: ${y}`);
};

main();