import { Application, interaction } from "pixi.js";
import { model, onClick, p1Score, p0Score, winner, player } from "./index-script";

const SCALE_X: number = window.innerWidth / 13.3;
const OFFSET: number = 60;
const BUCKET_X_OFFSET = window.innerWidth / 4.25;
const ROW_0_Y = window.innerHeight / 3.2;
const ROW_1_Y = window.innerHeight / 1.28;
const CIRCLE_RADIUS: number = window.innerWidth / 45;
const STORE_X_OFFSET = window.innerWidth / 4;
const NUM_BUCKETS: number = 12;
let currentPlayer: number = 0;
let buckets: PIXI.Graphics[][] = [];
let playerTurnText: PIXI.Text = new PIXI.Text(`Player ${currentPlayer}`);
const app: Application = new Application({ width: window.innerWidth - 20, height: window.innerHeight - 20, backgroundColor: 0xFFFFFF });

let p1store = new PIXI.Graphics();
let p0store = new PIXI.Graphics();
// TODO: Change image for stones
// Make buckets and stores a little bigger/ make sure we're happy with alignment
// Reposition player scores
// TODO Remove ALPHA/TRANSPARENCY FROM BUCKETS/STORES TO MOVE THEM AROUND

export let drawBoard = (): void => {
    document.body.appendChild(app.view);
    drawBackground();
    drawBuckets();
    initStores();
    drawStones();
    app.stage.addChild(playerTurnText);
};
window["drawBoard"] = drawBoard;

let drawBackground = () => {
    let board = PIXI.Sprite.from("board.png");
    board.width = window.innerWidth;
    board.height = window.innerHeight;
    app.stage.addChild(board);
};

let drawBuckets = () => {
    for (let row = 0; row < 2; row++) {
        buckets[row] = [];
        for (let col = 1; col < 7; col++) {
            let bucket = new PIXI.Graphics();
            bucket.beginFill(row === 0 ? 0xffff00 : 0x00ff00, 0);
            bucket.drawCircle(col * SCALE_X + BUCKET_X_OFFSET, getRowY(row), CIRCLE_RADIUS);
            bucket.endFill();
            bucket.interactive = true;
            bucket.name = row + ", " + (col - 1);
            bucket.on("mousedown", ourOnClick);
            buckets[row][col - 1] = bucket;
            app.stage.addChild(bucket);
        }
    }
};


let initStores = () => {
    let storeWidth = CIRCLE_RADIUS * 2;
    let storeHeight = getRowY(1) - getRowY(0) + storeWidth;
    console.log(window.innerWidth);
    p0store.beginFill(0xffff00, 0);
    p0store.drawRoundedRect(STORE_X_OFFSET - CIRCLE_RADIUS * 2, getRowY(0) - CIRCLE_RADIUS, storeWidth, storeHeight, 30);
    p0store.endFill();

    p1store.beginFill(0x00ff00, 0);
    p1store.drawRoundedRect(window.innerWidth - STORE_X_OFFSET, getRowY(0) - CIRCLE_RADIUS, storeWidth, storeHeight, 30);
    p1store.endFill();

    app.stage.addChild(p0store);
    app.stage.addChild(p1store);
};

let drawStores = () => {

    p1store.removeChildren();
    for (let numStones = 0; numStones < p1Score; numStones++) {
        let bounds = p1store.getBounds();
        let stone = PIXI.Sprite.from("stones2.png");
        stone.scale = new PIXI.Point(.4, .4);
        stone.anchor.set(.5);
        stone.x = getRandomInt(bounds.left + 20, bounds.right - 20);
        stone.y = getRandomInt(bounds.top + 20, bounds.bottom - 20);
        p1store.addChild(stone);
    }

    let p1amountOfStones: PIXI.Text = new PIXI.Text("" + p1Score);
    p1store.addChild(p1amountOfStones);
    p1amountOfStones.position.x = STORE_X_OFFSET;
    p1amountOfStones.position.y = OFFSET - CIRCLE_RADIUS + 150;


    p0store.removeChildren();
    for (let numStones = 0; numStones < p0Score; numStones++) {
        let bounds = p0store.getBounds();
        let stone = PIXI.Sprite.from("stones2.png");
        stone.scale = new PIXI.Point(.4, .4);
        stone.anchor.set(.5);
        stone.x = getRandomInt(bounds.left + 20, bounds.right - 20);
        stone.y = getRandomInt(bounds.top + 20, bounds.bottom - 20);
        p0store.addChild(stone);
    }
    let p2amountOfStones: PIXI.Text = new PIXI.Text("" + p0Score);
    p0store.addChild(p2amountOfStones);
    p2amountOfStones.position.x = OFFSET;
    p2amountOfStones.position.y = OFFSET - CIRCLE_RADIUS + 150;
};


let drawStones = (): void => {
    // Draw from the model
    for (let row = 0; row < model.length; row++) {
        for (let col = 0; col < model[row].length; col++) {
            // Delete this later if we want
            let bucket = buckets[row][col];
            bucket.removeChildren();


            for (let numStones = 0; numStones < model[row][col]; numStones++) {
                let bounds = bucket.getBounds();
                let stone = PIXI.Sprite.from("stones2.png");
                stone.scale = new PIXI.Point(.4, .4);
                stone.anchor.set(.5);
                stone.x = getRandomInt(bounds.left + 20, bounds.right - 20);
                stone.y = getRandomInt(bounds.top + 20, bounds.bottom - 20);
                bucket.addChild(stone);
            }
            let amountOfStones = new PIXI.Text("" + model[row][col]);
            amountOfStones.style.fill = 0xFFFFFF;
            bucket.addChild(amountOfStones);
            amountOfStones.position.x = (col + 1) * SCALE_X + BUCKET_X_OFFSET;
            amountOfStones.position.y = getNumStonesLabelY(row);
        }
    }
};

export let drawPlayerTurn = (p: number) => {
    playerTurnText.text = `Player ${p}`;
};

let getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

let isInBounds = (x: number, y: number, rect: PIXI.Rectangle): boolean => {
    return (x >= rect.left && x <= rect.right && y <= rect.bottom && y >= rect.top);
};

export let getIndexFromClick = (event: interaction.InteractionEvent): string => {
    let x = event.data.global.x;
    let y = event.data.global.y;
    for (let row = 0; row < buckets.length; row++) {
        for (let col = 0; col < buckets[row].length; col++) {
            let bounds = buckets[row][col].getBounds();
            if (isInBounds(x, y, bounds)) {
                return buckets[row][col].name;
            } else {
                continue;
            }
        }
    }

    return "No bounds found";
};

let callAlerts = () => {
    if (winner === -1) {
        alert("Tie Game!");
    } else if (winner >= 0) {
        alert(`Player ${winner} wins!!`);
    } else if (player === currentPlayer) {
        alert(`Player ${player} gets to go again!`);
    }
};

let ourOnClick = (event: interaction.InteractionEvent) => {
    let stringCoords = getIndexFromClick(event);
    let coords = stringCoords.split(",");
    let [row, col] = coords.map(x => parseInt(x, 10));
    currentPlayer = player;
    if (onClick(row, col)) {
        drawStones();
        drawStores();
        drawPlayerTurn(player);
        setTimeout(function () { callAlerts(); }, 20);
    } else {
        alert("Not your turn or your bucket is empty");
    }
};

let getRowY = (row: number) => row === 0 ? ROW_0_Y : ROW_1_Y;
let getNumStonesLabelY = (row: number) => {
    let offset = window.innerHeight / 8;
    return row === 0 ? ROW_0_Y - offset : ROW_1_Y + offset / 1.6;
};