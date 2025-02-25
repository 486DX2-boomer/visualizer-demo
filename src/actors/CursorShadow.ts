import { Actor } from "../classes/Actor";
import * as PixiJs from "pixi.js";

interface MousePosition {
  x: number;
  y: number;
}

export class CursorShadow implements Actor {
  private mousePosition: MousePosition = { x: 0, y: 0 }; // Reference to variable in Scene.ts. Should be a class?
  private cursorShadow: PixiJs.Graphics;

  appReference: PixiJs.Application;

  constructor(appReference: PixiJs.Application, mousePosition: MousePosition) {
    this.mousePosition = mousePosition;
    this.cursorShadow = new PixiJs.Graphics();
    this.appReference = appReference;

    this.cursorShadow.circle(mousePosition.x, mousePosition.y, 66);
    this.cursorShadow.fill(0xffffff);

    const cursorShadowBlur = new PixiJs.BlurFilter();
    cursorShadowBlur.strength = 36;
    this.cursorShadow.alpha = 0.19;
    this.cursorShadow.filters = [cursorShadowBlur];
  }

  addToStage() {
    this.appReference.stage.addChild(this.cursorShadow);
  }

  update() {
    this.cursorShadow.position.set(this.mousePosition.x, this.mousePosition.y);
  }
}
