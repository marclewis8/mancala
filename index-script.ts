declare let drawBoard: () => void;

export let model: number[][] = [];
export let p1Score: number = 0;
export let p0Score: number = 0;
export let winner: number = Number.NaN;
export let player: number = 0;

export let main = async () => {
    initModel();
    drawBoard();
};

export let initModel = (): void => {
    return;
};

export let onClick = (row: number, col: number): boolean => {
    return true;
};

export let checkIfGameOver = (): void => {
    return;
};

export let clearRow = (row: number): void => {
    return;
};

export let sumRow = (row: number): number => {
    return 0;
};

main();