// The scene should encapsulate all records in the scene and call their update behaviors

import * as PixiJs from "pixi.js";
import { Connection } from "./Connection";
import { ActorCollection } from "./ActorCollection";
import { BackgroundGradient } from "../actors/BackgroundGradient";
import { CursorShadow } from "../actors/CursorShadow";
import { BunnyExample } from "../actors/BunnyExample";
import { RecordActorFactory } from "./RecordActorFactory";

export class Scene {
  protected appReference: PixiJs.Application;

  constructor(appReference: PixiJs.Application) {
    this.appReference = appReference;
  }

  async load() {
    // Mouse position capture
    const mousePosition = { x: 0, y: 0 };
    this.appReference.stage.eventMode = "static"; // enables event handling on this container
    this.appReference.stage.hitArea = this.appReference.screen; // Defines where the container can receive events
    this.appReference.stage.on("pointermove", (event) => {
      mousePosition.x = event.global.x;
      mousePosition.y = event.global.y;
    });

    // Manage all actors
    const actors = new ActorCollection(this.appReference);
    // Call update on all actors per scene update
    this.appReference.ticker.add(() => {
      actors.update();
    });

    // Actor setup
    // Add background
    actors.addActor(new BackgroundGradient(this.appReference));
    // Cursor shadow effect
    actors.addActor(new CursorShadow(this.appReference, mousePosition));

    // Spinning bunny example
    // let bunnyExample = new BunnyExample(this.appReference);

    // bunnyExample loads a sprite, which is async. Because of that, we can't add it to actors straight away.

    // await bunnyExample.init(); // Comment out this line to see graceful error handling.

    // actors.addActor(bunnyExample);

    // Fetch records from the mock endpoint
    const connection = new Connection();
    const records = await connection.fetchRecords();
    console.log(`Records received in Scene: ${records.length}`);

    // Initialize the factory and create actors
    const factory = new RecordActorFactory(
      this.appReference,
      actors,
      50,
      mousePosition
    );

    // Create all record actors and their relationships
    factory.createRecordActors(records);

    const demoText = `this demo visualizes CRM records retrieved from a mock endpoint 
    and draws lines to represent their relationships
    this demo covers:
    Types: interfaces, abstract classes, discriminated unions, generics
Safety: schema validation, null checks, type guards
Async: promises, async/await, error handling
External library integration: PixiJS, Zod with type definitions
Events: pointer events, click and drag
Architecture: component-based
Practices: explicit types, access control, error handling, immutability`;

    const demoTextStyle = new PixiJs.TextStyle({fontSize: 12, fill: 0xffffff, align: 'center'});
    const demoTextGraphic = new PixiJs.Text({ text: demoText, style: demoTextStyle});
    demoTextGraphic.position = {x: 0, y: this.appReference.canvas.height - demoTextGraphic.height - 24}
    this.appReference.stage.addChild(demoTextGraphic);
  }
}
