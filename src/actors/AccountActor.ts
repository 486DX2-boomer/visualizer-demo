import * as PixiJs from "pixi.js";
import { RecordActor } from "./RecordActor";


export class AccountActor extends RecordActor {
  // private glowFilter: PixiJs.ColorMatrixFilter;
  private sinMod: number;

  // The super call is unnecessary- if the constructor is absent, parent constructor is called by defualt
  constructor(appReference: PixiJs.Application, recordData: any, mousePos: { x: number; y: number; }) {
    super(appReference, recordData, mousePos);
    this.sinMod = Math.random() * 10;
  }

  configureGraphic() {
    const ellipse = new PixiJs.Graphics();
    ellipse.ellipse(this.container!.x, this.container!.y, 20, 20);
    ellipse.beginFill(0x55d6f5);
    ellipse.endFill();
    this.container!.addChild(ellipse);

    const gradient = new PixiJs.Graphics();
    gradient.beginFill(0xabfbf6, 0.4);
    gradient.drawCircle(2, -4, 12.0);
    gradient.endFill();
    this.container?.addChild(gradient);

    // Looks bad, won't use
    // this.glowFilter = new PixiJs.ColorMatrixFilter();
    // this.glowFilter.brightness(1.2, false);
    // this.container!.filters = [this.glowFilter];
    this.hitAreaOffset = 15;
    this.hitAreaRadius = 30;

    this.container!.pivot.x = 10;
    this.container!.pivot.y = 10;
  }

  update() {
    // This is the same code as ContactActor
    // Should be refactored out to a "behavioral component" common to both classes
    this.sinMod += 0.02;
    if (this.sinMod > Math.PI * 2) {
      this.sinMod = 0;
    }
    const bobAmount = 0.04;
    const swayAmount = 0.01;
    this.container!.position.y =
      this.container!.position.y + Math.sin(this.sinMod) * bobAmount;
    this.container!.position.x +=
      Math.cos(this.sinMod * 0.7) * 0.2 * swayAmount;

    // handle drag
    this.drag();

    return;
  }
}
