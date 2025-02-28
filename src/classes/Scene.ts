// The scene should encapsulate all records in the scene and call their update behaviors

// Scene can be made abstract/interface and then concrete scenes that implement it
// can be written, and main.ts can switch scenes at will.
// But this is a single-scene application, so I'm not doing that

import * as PixiJs from "pixi.js";
import { Connection } from "./Connection";
import { ActorCollection } from "./ActorCollection";
import { BackgroundGradient } from "../actors/BackgroundGradient";
import { CursorShadow } from "../actors/CursorShadow";
import { BunnyExample } from "../actors/BunnyExample";

import { ContactActor, AccountActor, MockRecord } from "./Record";

export class Scene {
  protected appReference: PixiJs.Application;

  constructor(appReference: PixiJs.Application) {
    this.appReference = appReference;
  }

  async load() {
    // Mouse position capture. Should be an object updated on the main loop?
    // Many actors react to mouse position! this is important
    let mousePosition = { x: 0, y: 0 };
    this.appReference.stage.eventMode = "static"; // enables event handling on this container
    this.appReference.stage.hitArea = this.appReference.screen; // Defines where the container can receive events
    this.appReference.stage.on("pointermove", (event) => {
      // mousePosition = event.global.clone(); // this creates a new reference that breaks if anything else references it
      mousePosition.x = event.global.x; // do this to maintain the reference
      mousePosition.y = event.global.y;
    });

    // Manage all actors
    const actors = new ActorCollection(this.appReference);
    // Call update on all actors per scene update
    this.appReference.ticker.add(() => {
      actors.update();
    });

    // Actor setup
    // Add bg
    actors.addActor(new BackgroundGradient(this.appReference));
    // Cursor shadow effect
    actors.addActor(new CursorShadow(this.appReference, mousePosition));
    // Spinning bunny example
    let bunnyExample = new BunnyExample(this.appReference);
    // bunnyExample loads a sprite, which is async. Because of that, we can't add it to actors straight away.
    // Instead, we have to declare it first, call its async init, and then add it.
    await bunnyExample.init(); // Comment out this line to see graceful error handling.
    actors.addActor(bunnyExample);

    // record loading logic - refactor this out to a method later
    // initialize a Connection
    const con: Connection = new Connection();
    // Connection is responsbile for calling the mock endpoint
    const r: any[] = await con.fetchRecords();
    // confirm we got the data
    console.log("Records received in Scene:", r);
    console.log("Number of records:", r.length);
    console.log("First record sample:", r[0]);

    // Get all the Records from the Connection
    // Convert them to a drawable representation
    // Add them to the actor collection

    createRecordActors(this.appReference, r, actors);
  }
}

// SERIOUSLY clean this up later. make a factory class that accepts a JSON response
// This is just to show how RecordActors can get drawn to the scene
function createRecordActors(
  appReference: PixiJs.Application,
  response: any[],
  actors: ActorCollection
) {

  let xOffset = 0;
  let yOffset = 0;

  for (let r of response) {
    switch (r.type) {
      case "Account":
        const a = new AccountActor(appReference, r);
        xOffset += 22;
        actors.addActor(a);
        (a.graphic as PixiJs.Graphics).position.set(xOffset, 10)
        break;
      case "Contact":
        const c = new ContactActor(appReference, r);
        yOffset += -24;
        actors.addActor(c);
        (c.graphic as PixiJs.Graphics).position.set(0, -yOffset)
        break;
    }
  }
}
