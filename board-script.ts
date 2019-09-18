import { Application, interaction } from "pixi.js";
import { model, numStones, onClick } from "./index-script";
import { numberTypeAnnotation } from "babel-types";

const SCALE_X: number = 100;
const SCALE_Y: number = 100;
const OFFSET: number = 60;
const CIRCLE_RADIUS: number = 30;
const NUM_BUCKETS: number = 12;
let buckets: PIXI.Graphics[][] = [];

export let drawBoard = (): void => {

    const app: Application = new Application({ width: window.innerWidth - 20, height: window.innerHeight - 20, backgroundColor: 0xFFFFFF });
    document.body.appendChild(app.view);

    // Initialize the pixi Graphics class

    drawBackground(app);
    drawBuckets(app);
    drawStores(app);
    drawStones(app);
};

let drawBackground = (app: Application) => {
    let board = new PIXI.Graphics();
    board.beginFill(0x0000ff);
    board.drawRoundedRect(0, 0, app.view.width, app.view.height, 30);
    board.endFill();
    board.interactive = true;
    board.on("mousedown", (event: interaction.InteractionEvent) => { console.log("we clicked"); });
    app.stage.addChild(board);
};

let drawBuckets = (app: Application) => {
    for (let row = 0; row < 2; row++) {
        buckets[row] = [];
        for (let col = 1; col < 7; col++) {
            let bucket = new PIXI.Graphics();
            bucket.beginFill(0xff0000);
            bucket.drawCircle(col * SCALE_X + OFFSET, row * SCALE_Y + OFFSET, CIRCLE_RADIUS);
            bucket.endFill();
            bucket.interactive = true;
            bucket.name = row + ", " + (col - 1);
            bucket.on("mousedown", onClick);
            buckets[row][col - 1] = bucket; 
            app.stage.addChild(bucket);

        }
    }
};

let drawStores = (app: Application) => {
    let p1store = new PIXI.Graphics();
    p1store.beginFill(0x00ff00);
    p1store.drawRoundedRect(window.innerWidth / 2 + 100, OFFSET - CIRCLE_RADIUS, CIRCLE_RADIUS * 2, CIRCLE_RADIUS * 3 + OFFSET, 30);
    p1store.endFill();
    app.stage.addChild(p1store);

    let p2store = new PIXI.Graphics();
    p2store.beginFill(0xffff00);
    p2store.drawRoundedRect(OFFSET, OFFSET - CIRCLE_RADIUS, CIRCLE_RADIUS * 2, CIRCLE_RADIUS * 3 + OFFSET, 30);
    p2store.endFill();
    app.stage.addChild(p2store);
};


let drawStones = (app: Application) => {
    for (let i = 0; i < numStones; i++) {
        let stone = PIXI.Sprite.from("rameses.png");
        stone.scale = new PIXI.Point(.05, .05);
        stone.anchor.set(.5);
        let bucket = app.stage.getChildAt((i % NUM_BUCKETS) + 1);
        let bounds = bucket.getBounds();
        stone.x = getRandomInt(bounds.left + 20, bounds.right - 20);
        stone.y = getRandomInt(bounds.top + 20, bounds.bottom - 20);
        bucket.addChild(stone);
    }
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
    console.log(event.data.global.x);
    console.log(buckets[0][0].getBounds());

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
    


