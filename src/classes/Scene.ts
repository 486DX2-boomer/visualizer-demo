// The scene should encapsulate all records in the scene and call their update behaviors

import * as PixiJs from "pixi.js";
import { Connection } from "./Connection"

export class Scene {
  protected appReference: PixiJs.Application;

  constructor(appReference: PixiJs.Application) {
    this.appReference = appReference;
  }

  async load() {
    // Load the bunny texture
    const texture = await PixiJs.Assets.load("/assets/bunny.png");

    // Create a bunny Sprite
    const bunny = new PixiJs.Sprite(texture);

    // Center the sprite's anchor point
    bunny.anchor.set(0.5);

    // Move the sprite to the center of the screen
    bunny.position.set(
      this.appReference.screen.width / 2,
      this.appReference.screen.height / 2
    );

    // Add the bunny to the stage
    this.appReference.stage.addChild(bunny);

    // Listen for animate update
    this.appReference.ticker.add((time) => {
      // Just for fun, let's rotate mr rabbit a little.
      // * Delta is 1 if running at 100% performance *
      // * Creates frame-independent transformation *
      bunny.rotation += 0.1 * time.deltaTime;
    });

    // The background should be a dark grey-medium gray gradient
    // Or maybe blue? For more color?

    // The background should be "highlighted" behind the player's cursor position.
    // Just a white sphere, radially blurred with alpha can do this.

    // initialize a Connection
    const c: Connection = new Connection();
    // Connection is responsbile for calling the mock endpoint
    const r: any[] = await c.fetchRecords();

    // confirm we got the data
    console.log("Records received in Scene:", r);
    console.log("Number of records:", r.length);
    console.log("First record sample:", r[0]);

    // Get all the Records from the Connection
    // Add them to a scene graph
    // Iterate over the graph at intervals to update their behavior and presentation

    interface cursorAtTextExample extends PixiJs.Text {
        offsetX: number;
        offsetY: number;
    }
    const text: cursorAtTextExample = new PixiJs.Text({
        text: "hello world",
        style: {
          fontFamily: "monospace",
          fontSize: 24,
          fill: 0xffffff,
          align: "left",
        },
        // declare these outside of the constructor to avoid linter complaint
        // offsetX: -72,
        // offsetY: -24
      }) as cursorAtTextExample;

      text.offsetX = -72,
      text.offsetY = -24

    let mousePosition = { x: 0, y: 0 };
    this.appReference.stage.eventMode = "static"; // Enables event handling on this container
    this.appReference.stage.hitArea = this.appReference.screen; // Defines where the container can receive events

    this.appReference.stage.on("pointermove", (event) => {
      mousePosition = event.global.clone(); // grabs the position on pointer move
    });

    this.appReference.ticker.add(() => {
      // on update, sets the captured position
      text.position.set(mousePosition.x + text.offsetX, mousePosition.y + text.offsetY);
    });

    this.appReference.stage.addChild(text);
  }
}
