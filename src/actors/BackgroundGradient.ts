import { Actor } from "../classes/Actor";
import * as PixiJs from "pixi.js";

export class BackgroundGradient implements Actor {
  private color1 = 0x37bae0;
  private color2 = 0x096681;
  private bgGradient: PixiJs.Graphics;

  appReference: PixiJs.Application;

  constructor(appReference: PixiJs.Application) {
    this.appReference = appReference;

    const radialGradient = new PixiJs.FillGradient({
      type: "radial",
      center: { x: 0.5, y: 0.33 },
      innerRadius: 0,
      outerCenter: { x: 0.5, y: 0.33 },
      outerRadius: 0.7,
      colorStops: [
        { offset: 0, color: this.color1 },
        { offset: 1, color: this.color2 },
      ],
      textureSpace: "local",
    });

    this.bgGradient = new PixiJs.Graphics();
    this.bgGradient.rect(
      0,
      0,
      appReference.screen.width,
      appReference.screen.height
    );
    this.bgGradient.fill(radialGradient);
  }

  addToStage() {
    this.appReference.stage.addChild(this.bgGradient);
  }

  update() {
    return;
  }
}
