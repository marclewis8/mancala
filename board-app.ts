
export let drawBoard = (): void => {

let renderer = PIXI.autoDetectRenderer(screen.width, screen.height, { backgroundColor: 0x000000, antialias: true });
document.body.appendChild(renderer.view);

// Create the main stage for your display objects
let stage = new PIXI.Container();

// Initialize the pixi Graphics class
let graphics = new PIXI.Graphics();
graphics.beginFill(0x0000ff);
graphics.drawRoundedRect(0, 0, screen.width, (screen.height / 2), 5);
graphics.endFill();

stage.addChild(graphics);
renderer.render(stage);

};
