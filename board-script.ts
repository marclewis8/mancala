import { Application, interaction } from "pixi.js";
import { model, onClick, p1Score, p0Score, winner, player } from "./index-script";

const SCALE_X: number = window.innerWidth / 13.3;
const BUCKET_X_OFFSET = window.innerWidth / 4.25;
const ROW_0_Y = window.innerHeight / 3.2;
const ROW_1_Y = window.innerHeight / 1.28;
const BUCKET_RADIUS: number = window.innerWidth / 45;
const STONE_RADIUS: number = PIXI.Sprite.from("stone.png").width * .2;
const STORE_X_OFFSET = window.innerWidth / 4;
let currentPlayer: number = 0;
let buckets: PIXI.Graphics[][] = [];
let playerTurnText: PIXI.Text = new PIXI.Text(`Player ${currentPlayer}`);
let p0Store = new PIXI.Graphics();
let p1Store = new PIXI.Graphics();
let p0ScoreText = new PIXI.Text();
let p1ScoreText = new PIXI.Text();
const app: Application = new Application(
    { width: window.innerWidth * (63 / 64), height: window.innerHeight * (251 / 261), backgroundColor: 0xFFFFFF });
export let drawBoard = (): void => {
    document.body.appendChild(app.view);
    drawBackground();
    drawBuckets();
    initStores();
    initScoreText();
    initPlayerText();
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
            bucket.drawCircle(col * SCALE_X + BUCKET_X_OFFSET, getRowY(row), BUCKET_RADIUS);
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
    let storeWidth = BUCKET_RADIUS * 2;
    let storeHeight = getRowY(1) - getRowY(0) + storeWidth;
    p0Store.beginFill(0xffff00, 0);
    p0Store.drawRoundedRect(STORE_X_OFFSET - BUCKET_RADIUS * 2, getRowY(0) - BUCKET_RADIUS, storeWidth, storeHeight, 30);
    p0Store.endFill();

    p1Store.beginFill(0x00ff00, 0);
    p1Store.drawRoundedRect(window.innerWidth - STORE_X_OFFSET, getRowY(0) - BUCKET_RADIUS, storeWidth, storeHeight, 30);
    p1Store.endFill();

    app.stage.addChild(p0Store);
    app.stage.addChild(p1Store);
};

let initScoreText = () => {
    p0ScoreText.text = "" + p0Score;
    p0ScoreText.style.fill = 0xFFFFFF;
    p0ScoreText.position.x = STORE_X_OFFSET - BUCKET_RADIUS - p0ScoreText.width / 2;
    p0ScoreText.position.y = getRowY(0) - 3 * BUCKET_RADIUS;
    p1ScoreText.text = "" + p1Score;
    p1ScoreText.position.x = window.innerWidth - STORE_X_OFFSET + BUCKET_RADIUS + 3 - p1ScoreText.width / 2;
    p1ScoreText.style.fill = 0xFFFFFF;
    p1ScoreText.position.y = getRowY(0) - 3 * BUCKET_RADIUS;
    p0Store.addChild(p0ScoreText);
    p1Store.addChild(p1ScoreText);
};

let initPlayerText = () => {
    playerTurnText.style.fill = 0xFFFFFF;
    playerTurnText.position.x = window.innerWidth / 2 - playerTurnText.width / 2;
    playerTurnText.position.y = window.innerHeight / 14.4;

};

let drawStores = () => {
    fillStoresWithStones(0);
    fillStoresWithStones(1);
};

let fillStoresWithStones = (player: number) => {
    let isPlayer0 = player === 0;
    let store = isPlayer0 ? p0Store : p1Store;
    let score = isPlayer0 ? p0Score : p1Score;
    let scoreText = isPlayer0 ? p0ScoreText : p1ScoreText;
    store.removeChildren();
    for (let numStones = 0; numStones < score; numStones++) {
        let bounds = store.getBounds();
        let stone = PIXI.Sprite.from("stone.png");
        stone.scale = new PIXI.Point(.4, .4);
        stone.anchor.set(.5);
        let midX = bounds.width / 2;
        let midY = bounds.height / 2;
        let rX = Math.random() * midX - (window.innerWidth * .078125) * STONE_RADIUS;
        let rY = Math.random() * midY - (window.innerHeight * .19157) * STONE_RADIUS;
        let theta = Math.random() * 2 * Math.PI;
        stone.x = bounds.left + midX + rX * Math.cos(theta);
        stone.y = bounds.top + midY + rY * Math.sin(theta);
        store.addChild(stone);
    }
    if (isPlayer0) {
        scoreText.position.x = STORE_X_OFFSET - BUCKET_RADIUS - scoreText.width / 2;
    } else {
        scoreText.position.x = window.innerWidth - STORE_X_OFFSET + BUCKET_RADIUS + 3 - scoreText.width / 2;
    }
    scoreText.text = "" + score;
    store.addChild(scoreText);
};

let drawStones = (): void => {
    // Draw from the model
    for (let row = 0; row < model.length; row++) {
        for (let col = 0; col < model[row].length; col++) {
            let bucket = buckets[row][col];
            bucket.interactiveChildren = false;
            bucket.removeChildren();
            for (let numStones = 0; numStones < model[row][col]; numStones++) {
                let bounds = bucket.getBounds();
                let stone = PIXI.Sprite.from("stone.png");
                stone.scale = new PIXI.Point(.4, .4);
                stone.anchor.set(.5);
                let theta = Math.random() * 2 * Math.PI;
                let midpoint = bounds.width / 2;
                let r = Math.random() * midpoint - 100 * STONE_RADIUS;
                stone.x = bounds.left + midpoint + r * Math.cos(theta);
                stone.y = bounds.top + midpoint + r * Math.sin(theta);
                bucket.addChild(stone);
            }
            let amountOfStones = new PIXI.Text("" + model[row][col]);
            amountOfStones.style.fill = 0xFFFFFF;
            bucket.addChild(amountOfStones);
            amountOfStones.position.x = (col + 1) * SCALE_X + BUCKET_X_OFFSET - amountOfStones.width / 2;
            amountOfStones.position.y = getNumStonesLabelY(row);
        }
    }
};

export let drawPlayerTurn = (p: number) => {
    playerTurnText.text = `Player ${p}`;
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