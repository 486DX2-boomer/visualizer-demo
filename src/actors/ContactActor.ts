import * as PixiJs from "pixi.js";
import { RecordActor } from "./RecordActor";


export class ContactActor extends RecordActor {
  private sinMod: number;
  private glowFilter: PixiJs.ColorMatrixFilter | null = null;
  private pulseDirection: number = 1;
  private pulseValue: number = 0;

  constructor(appReference: PixiJs.Application, recordData: any, mousePos: { x: number; y: number; }) {
    super(appReference, recordData, mousePos);

    this.sinMod = Math.random() * 10; // randomize starting value to prevent synced animation
  }

  configureGraphic() {
    const graphic = new PixiJs.Graphics();

    graphic!.fill(0x6bf334);
    graphic!.stroke({ width: 2, color: 0x4da828 });
    graphic!.roundRect(0, 0, 24, 24, 3.2);
    graphic!.endFill();

    this.container!.addChild(graphic);

    // gradient effect
    const gradientGraphic = new PixiJs.Sprite(PixiJs.Texture.WHITE);
    gradientGraphic.width = 24;
    gradientGraphic.height = 24;

    gradientGraphic.tint = 0xffffff;
    gradientGraphic.alpha = 0.3;

    // Add a mask to make it rounded like base shape
    const gradientMask = new PixiJs.Graphics();
    gradientMask.fill(0xffffff);
    gradientMask.roundRect(0, 0, 24, 24, 6);
    gradientMask.endFill();

    gradientGraphic.mask = gradientMask;
    this.container!.addChild(gradientMask);

    gradientGraphic.height = 12; // cover top half


    // glow fx
    const blurFilter = new PixiJs.BlurFilter({ strength: 0.2, quality: 1 });
    this.glowFilter = new PixiJs.ColorMatrixFilter();
    this.glowFilter.brightness(1.2, false);

    graphic.filters = [blurFilter, this.glowFilter];
    this.container!.addChild(gradientGraphic);

    this.container!.pivot.x = 12;
    this.container!.pivot.y = 12;

    // rotation
    // this.container!.angle = Math.random() * 10 - 5;
    
    this.hitAreaOffset = 0;
    this.hitAreaRadius = 32;

    // mouse events
    this.container!.eventMode = "static"; // enables mouse events

    this.container!.on("pointerover", () => {
      this.container!.scale.set(1.15, 1.15);
      if (this.glowFilter) {
        this.glowFilter.brightness(1.5, false);
      }
    });

    this.container!.on("pointerout", () => {
      this.container!.scale.set(1, 1);
      if (this.glowFilter) {
        this.glowFilter.brightness(1.2, false);
      }
    });
  }

  update() {
    // Bobbing motion
    this.sinMod += 0.05;
    if (this.sinMod > Math.PI * 2) {
      this.sinMod = 0;
    }
    const bobAmount = 0.02;
    const swayAmount = 0.01;
    this.container!.position.y =
      this.container!.position.y + Math.sin(this.sinMod) * bobAmount;
    this.container!.position.x +=
      Math.cos(this.sinMod * 0.7) * 0.2 * swayAmount;

    // glow fx
    if (this.glowFilter) {
      this.pulseValue += 0.01 * this.pulseDirection;

      if (this.pulseValue >= 1) {
        this.pulseDirection = -1;
      } else if (this.pulseValue <= 0) {
        this.pulseDirection = 1;
      }

      // brightness mod
      const baseBrightness = 1.1;
      const pulseAmount = 0.5;
      this.glowFilter.brightness(
        baseBrightness + this.pulseValue * pulseAmount,
        false
      );
    }

    // handle drag
    this.drag();
  }
}
