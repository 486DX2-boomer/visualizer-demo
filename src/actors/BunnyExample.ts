import { Actor } from "../classes/Actor";
import * as PixiJs from "pixi.js";

export class BunnyExample implements Actor {
  private bunny: PixiJs.Sprite | undefined; // initialization is in init(), so this is OK
  appReference: PixiJs.Application;

  constructor(appReference: PixiJs.Application) {
    this.appReference = appReference;
  }

  async init(): Promise<void> {
    // example rotating sprite from the documentation
    const texture = await PixiJs.Assets.load("/assets/bunny.png");

    this.bunny = new PixiJs.Sprite(texture);

    this.bunny.anchor.set(0.5);

    this.bunny.position.set(
      this.appReference.screen.width / 2,
      this.appReference.screen.height / 2
    );
  }

  addToStage(): void {
    if (!this.bunny) {
        throw new Error(`The bunny wasn't initialized. Call init() before adding it to the stage`);
    }
    this.appReference.stage.addChild(this.bunny as PixiJs.Sprite);
  }

  update(): void {
    // Rotate the bunny
    (this.bunny as PixiJs.Sprite).rotation +=
      0.1 * this.appReference.ticker.deltaTime;
  }
}
