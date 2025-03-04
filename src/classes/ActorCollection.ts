// represents a collection of actors in a Scene
// each actor implements Actor interface (ie, an update method)

import { Actor } from "./Actor";
import * as PixiJs from "pixi.js";

export class ActorCollection implements Iterable<Actor> {
  actors: Actor[] = [];
  appReference: PixiJs.Application;

  constructor(appReference: PixiJs.Application) {
    this.appReference = appReference;
  }

  addActor(a: Actor) {
    try {
      a.addToStage();
      this.actors.push(a);
    } catch (error) {
      console.error("Couldn't add actor to scene: ", error);
    }
  }

  update() {
    for (let a of this.actors) {
      a.update();
    }
  }

  [Symbol.iterator](): Iterator<Actor> {
    return this.actors[Symbol.iterator]();
  }
}
