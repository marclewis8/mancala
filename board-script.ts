import { Application, interaction } from "pixi.js";

export let drawBoard = (): void => {

    const app: Application = new Application({ width: 496, height: 496, backgroundColor: 0xFFFFFF });
    document.body.appendChild(app.view);

    // Initialize the pixi Graphics class
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0x0000ff);
    graphics.drawRoundedRect(0, 0, app.view.width, app.view.height, 30);
    let board = graphics.endFill();
    board.interactive = true;
    board.on("mousedown", (event: interaction.InteractionEvent) => {console.log("we clicked"); });


    app.stage.addChild(graphics);
};
