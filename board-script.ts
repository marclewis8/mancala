import { Application, interaction } from "pixi.js";

const SCALE_X: number = 100;
const SCALE_Y: number = 100;
const OFFSET: number = 60;
const CIRCLE_RADIUS: number = 30;

export let drawBoard = (): void => {

    const app: Application = new Application({ width: window.innerWidth - 20, height: window.innerHeight - 20, backgroundColor: 0xFFFFFF });
    document.body.appendChild(app.view);

    // Initialize the pixi Graphics class
    let board = new PIXI.Graphics();
    board.beginFill(0x0000ff);
    board.drawRoundedRect(0, 0, app.view.width, app.view.height, 30);
    board.endFill();
    board.interactive = true;
    board.on("mousedown", (event: interaction.InteractionEvent) => {console.log("we clicked"); });

    app.stage.addChild(board);
    
    for (let row = 0; row < 2; row++) {
        for (let col = 1; col < 7; col++) {

            let bucket = new PIXI.Graphics();
            bucket.beginFill(0xff0000);
            bucket.drawCircle(col * SCALE_X + OFFSET, row * SCALE_Y + OFFSET, CIRCLE_RADIUS);
            bucket.endFill();
            bucket.interactive = true;
            bucket.name = row + ", " + col;
            bucket.on("mousedown", (event: interaction.InteractionEvent) => {console.log("clicked on " + bucket.name); });
            app.stage.addChild(bucket);

        }
    }

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
