import { Application, interaction } from "pixi.js";
import { model, onClick, p1Score, p0Score, winner, player } from "./index-script";

const SCALE_X: number = 100;
const SCALE_Y: number = 100;
const OFFSET: number = 60;
const CIRCLE_RADIUS: number = 30;
let boardX = window.innerWidth / 2 + 100;
const NUM_BUCKETS: number = 12;
let currentPlayer: number = 0;
let buckets: PIXI.Graphics[][] = [];
let playerTurnText: PIXI.Text = new PIXI.Text(`Player ${currentPlayer}`);
const app: Application = new Application({ width: window.innerWidth - 20, height: window.innerHeight - 20, backgroundColor: 0xFFFFFF });

let p1store = new PIXI.Graphics();
let p2store = new PIXI.Graphics();

export let drawBoard = (): void => {
    document.body.appendChild(app.view);
    drawBackground();
    drawBuckets();
    initStores();
    drawStones();
    app.stage.addChild(playerTurnText);
};

let drawBackground = () => {
    let board = new PIXI.Graphics();
    board.beginFill(0x0000ff);
    board.drawRoundedRect(0, 0, app.view.width, app.view.height, 30);
    board.endFill();
    // board.interactive = true;
    // board.on("mousedown", (event: interaction.InteractionEvent) => { console.log("we clicked"); });
    app.stage.addChild(board);

    // let board = PIXI.Sprite.from("board.png"); DO NOT UNCOMMENT THIS PLS
    board.width = window.innerWidth;
    board.height = window.innerHeight;
    app.stage.addChild(board);
};

let drawBuckets = () => {
    for (let row = 0; row < 2; row++) {
        buckets[row] = [];
        for (let col = 1; col < 7; col++) {
            let bucket = new PIXI.Graphics();
            bucket.beginFill(row === 0 ? 0xffff00 : 0x00ff00);
            bucket.drawCircle(col * SCALE_X + OFFSET, row * SCALE_Y + OFFSET, CIRCLE_RADIUS);
            bucket.endFill();
            bucket.interactive = true;
            bucket.name = row + ", " + (col - 1);
            bucket.on("mousedown", ourOnClick);
            buckets[row][col - 1] = bucket;
            app.stage.addChild(bucket);

            let amountOfStones: PIXI.Text = new PIXI.Text("");
            // bucket.add              
        }
    }
};


let initStores = () => {

    p1store.beginFill(0x00ff00);
    p1store.drawRoundedRect(boardX, OFFSET - CIRCLE_RADIUS, CIRCLE_RADIUS * 2, CIRCLE_RADIUS * 3 + OFFSET, 30);
    p1store.endFill();
    app.stage.addChild(p1store);

    p2store.beginFill(0xffff00);
    p2store.drawRoundedRect(OFFSET, OFFSET - CIRCLE_RADIUS, CIRCLE_RADIUS * 2, CIRCLE_RADIUS * 3 + OFFSET, 30);
    p2store.endFill();
    app.stage.addChild(p2store);
};

let drawStores = () => {

    p1store.removeChildren();
    for (let numStones = 0; numStones < p1Score; numStones++) {
        let bounds = p1store.getBounds();
        let stone = PIXI.Sprite.from("rameses.png");
        stone.scale = new PIXI.Point(.05, .05);
        stone.anchor.set(.5);
        stone.x = getRandomInt(bounds.left + 20, bounds.right - 20);
        stone.y = getRandomInt(bounds.top + 20, bounds.bottom - 20);
        p1store.addChild(stone);
    }

    let p1amountOfStones: PIXI.Text = new PIXI.Text("" + p1Score);
    p1store.addChild(p1amountOfStones);
    p1amountOfStones.position.x = boardX;
    p1amountOfStones.position.y = OFFSET - CIRCLE_RADIUS + 150;


    p2store.removeChildren();
    for (let numStones = 0; numStones < p0Score; numStones++) {
        let bounds = p2store.getBounds();
        let stone = PIXI.Sprite.from("rameses.png");
        stone.scale = new PIXI.Point(.05, .05);
        stone.anchor.set(.5);
        stone.x = getRandomInt(bounds.left + 20, bounds.right - 20);
        stone.y = getRandomInt(bounds.top + 20, bounds.bottom - 20);
        p2store.addChild(stone);
    }
    let p2amountOfStones: PIXI.Text = new PIXI.Text("" + p0Score);
    p2store.addChild(p2amountOfStones);
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
                let stone = PIXI.Sprite.from("rameses.png");
                stone.scale = new PIXI.Point(.05, .05);
                stone.anchor.set(.5);
                stone.x = getRandomInt(bounds.left + 20, bounds.right - 20);
                stone.y = getRandomInt(bounds.top + 20, bounds.bottom - 20);
                bucket.addChild(stone);
            }
            let amountOfStones = new PIXI.Text("" + model[row][col]);
            bucket.addChild(amountOfStones);
            amountOfStones.position.x = (col + 1) * SCALE_X + OFFSET - 10;
            amountOfStones.position.y = row * SCALE_Y + OFFSET + 30;

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