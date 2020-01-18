import { drawBoard, drawPlayerTurn } from "./board-script";

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

    for (let row = 0; row < 2; row++) { // run twice, once for each row
        model[row] = []; // initialize row
        for (let col = 0; col < 6; col++) { // run six times, once for each column
            model[row][col] = 4; // initialize index
        }
    }
};

export let onClick = (row: number, col: number): boolean => {
    let stonesInHand = model[row][col]; // store amount of stones at row,col in variable
    model[row][col] = 0; // clear out index

    if (row === 0) {
        // we're on top row, which is player 0 moving left
        if (player === 1 || stonesInHand === 0) {
            // player 1 cannot click on row 0
            // player can't click on empty bucket
            model[row][col] = stonesInHand; // put stones back and stop function
            return false;
        }
        let direction = -1; // move counterclockwise, on row 0 this means go left
        let goAgain = false;

        while (stonesInHand > 0) { 
            // one cycle = maximum of one stone placed
            // row, col now used to track what index we're "hovering over", not the start index
            col += direction;

            if (col === -1) { 
                // case where player 0's store is reached
                p0Score++;
                row++;
                direction *= -1; // start moving right on row 1, equiv to direction = 1;
                if (stonesInHand === 1) {
                    // get to go again
                    goAgain = true;
                }
                stonesInHand--;

            } else if (col === 6) { 
                // case where player 1's store is reached on player 0's turn
                row--;
                direction *= -1; // start moving left on row 0, equiv to direction = 1

            } else if (model[row][col] === 0 && stonesInHand === 1 && row === 0) { 
                // case to steal stones from index across from bucket
                p0Score += 1 + model[1][col];
                model[1][col] = 0;
                stonesInHand--;

            } else {
                model[row][col]++;
                stonesInHand--;

            }
        }

        // end loop, change player variable only if goAgain is false
        if (!goAgain) {
            player = 1;
        }

    } else {
        // we're on the bottom, which is player 1 moving right

        if (player === 0 || stonesInHand === 0) {
            // player 0 cannot click on row 1
            // player cannot click on empty bucket
            model[row][col] = stonesInHand; // put stones back and stop function
            return false;
        }

        let goAgain = false;
        let direction = 1; // on row 1, start moving right
        while (stonesInHand > 0) {
            col += direction;

            if (col === 6) {
                // At player 1's store, on player 1's turn (deposit)
                p1Score++;
                row--;
                direction *= -1;
                if (stonesInHand === 1) {
                    goAgain = true;
                }
                stonesInHand--;

            } else if (col === -1) {
                // At player 0's store on player 1's turn (skip)
                row++;
                direction = 1;

            } else if (model[row][col] === 0 && stonesInHand === 1 && row === 1) {
                // case to steal stones across, now stealing from row 0
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
    // run function after each turn
    checkIfGameOver();
    return true;
};

// TODO: make sure we don't need to return anything here
export let checkIfGameOver = () => {
    let sum1 = sumRow(1);
    let sum0 = sumRow(0);

    // game ends when sum0 or sum1 is true
    if (sum0 === 0 || sum1 === 0) {
        clearRow(0); // clear out both rows in model, sum values stored already
        clearRow(1);
        p0Score += sum0; // one of these will simply add 0 to the player's score (b/c of condition), which is fine
        p1Score += sum1;
        if (p1Score > p0Score) {
            winner = 1;
        } else if (p0Score > p1Score) {
            winner = 0;
        } else {
            winner = -1; // -1 = tie
        }
    }
};

export let clearRow = (row: number) => {
    // helper function to clear out a row
    for (let col = 0; col < model[row].length; col++) {
        model[row][col] = 0;
    }
};

export let sumRow = (row: number) => {
    // helper function to sum each row
    let count = 0;
    for (let col = 0; col < 6; col++) {
        count += model[row][col];
    }
    return count;
};

main();