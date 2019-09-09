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
        for (let col = 0; col < 6; col++) {

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



};
