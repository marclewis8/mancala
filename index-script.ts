import { drawBoard } from "./board-script";

export const numStones: number = 48;
export const numBuckets: number = 12;
export let model: number[] = [];

export let main = async () => {
    initModel();
    drawBoard();
};

let initModel = () => {
    for (let i = 0; i < numBuckets; i++) {
        model[i] = 4;
    }
};

main();