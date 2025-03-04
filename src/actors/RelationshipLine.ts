import * as PixiJs from "pixi.js";
import { RecordActor } from "./RecordActor";
import { Actor } from "../classes/Actor.ts";

export class RelationshipLine implements Actor {
  appReference: PixiJs.Application<PixiJs.Renderer>;

  private container: PixiJs.Container;
  private line: PixiJs.Graphics;

  private beginRecord: RecordActor;
  private endRecord: RecordActor;

  private beginX: number;
  private beginY: number;

  private endX: number;
  private endY: number;

  constructor(
    appReference: PixiJs.Application,
    beginRecord: RecordActor,
    endRecord: RecordActor
  ) {
    this.appReference = appReference;

    this.beginRecord = beginRecord;
    this.endRecord = endRecord;

    this.beginX = this.beginRecord.container!.x;
    this.beginY = this.beginRecord.container!.y;
    this.endX = this.endRecord.container!.x;
    this.endY = this.endRecord.container!.y;

    this.container = new PixiJs.Container();
    this.container.eventMode = "none";

    this.line = new PixiJs.Graphics();
    // this.line.moveTo(this.beginX, this.beginY).lineTo(this.endX, this.endY);
    // this.line.stroke({ color: 0xffffff, width: 2, alpha: 0.5 });
    this.container.addChild(this.line);
  }

  addToStage() {
    this.appReference.stage.addChild(this.container);
  }

  update() {
    this.beginX = this.beginRecord.container!.position.x;
    this.beginY = this.beginRecord.container!.position.y;
    this.endX = this.endRecord.container!.position.x;
    this.endY = this.endRecord.container!.position.y;

    this.line.clear();
    this.line.moveTo(this.beginX, this.beginY).lineTo(this.endX, this.endY);
    this.line.stroke({ color: 0xffffff, width: 2, alpha: 0.5 });
  }
}
