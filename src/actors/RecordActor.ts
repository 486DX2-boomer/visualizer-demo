import * as PixiJs from "pixi.js";
import { Tooltip } from "../actors/Tooltip";
import { Actor } from "../classes/Actor";
import { MockRecord } from "../classes/Record";

// interface Opportunity extends mockRecord {
// }
// export unneeded here?
// export interface RecordActor extends MockRecord, Actor {
//     sprite?: PixiJs.Sprite;
//     shape?: any; // if I decide to make the accounts circles, squares, etc
//     // relationship?: RecordRelationship; // Don't know how to implement the relationship drawing yet
// }
// RecordActor separates the graphical representation and the data into different members
export abstract class RecordActor implements Actor {
  appReference: PixiJs.Application;
  container: PixiJs.Container | undefined;
  protected recordData: MockRecord;

  protected isDragging: boolean = false;
  protected globalMousePositionRef: { x: number; y: number; };

  protected tooltip: Tooltip;

  // Fix type annotation here
  protected hitAreaOffset: number; // set it before setupInteractivity
  protected hitAreaRadius: number;

  constructor(appReference: PixiJs.Application, recordData: MockRecord, mousePos: { x: number; y: number; }) {
    this.appReference = appReference;

    this.container = new PixiJs.Container();

    this.recordData = Object.assign({} as MockRecord, recordData);
    // the spread operator will also shallow copy the props, but I think .assign is more explicit
    // this.recordData = { ...recordData };
    this.globalMousePositionRef = mousePos;

    // add the box that displays record data on hover
    this.tooltip = new Tooltip(this.recordData, this.container);
    this.container.addChild(this.tooltip!.container);

  }

  protected setupInteractivity(): void {
    if (this.container) {
      // Enable interactivity
      this.container.eventMode = "dynamic";
      this.container.cursor = "pointer";

      this.container.hitArea = new PixiJs.Rectangle(
        this.container.x - this.hitAreaOffset,
        this.container.y - 15,
        this.hitAreaRadius,
        this.hitAreaRadius
      );

      // Add pointer events
      // have to use .bind here? or could define the method inline with arrow
      this.container.on("pointerover", this.onPointerOver.bind(this));
      this.container.on("pointerout", this.onPointerOut.bind(this));
      // on click
      this.container.on("pointerdown", this.onPointerDown.bind(this));

      this.container.on("pointerup", this.onPointerUp.bind(this));
    }
  }

  protected onPointerOver(): void {
    console.log(`Mouse over record: ${this.recordData.Id}`);
    this.container!.scale = 1.2;
    // toggle tooltip
    this.tooltip.container.visible = !this.tooltip.container.visible;
  }

  protected onPointerOut(): void {
    // Reset appearance
    this.container!.scale = 1.0;
    this.tooltip.container.visible = !this.tooltip.container.visible;
  }

  protected onPointerDown(): void {
    console.log(`Clicked record: ${this.recordData.Id}`);
    console.log("Record details:", this.recordData);

    // initialize drag
    this.isDragging = true;
  }

  protected onPointerUp(): void {
    // end drag
    this.isDragging = false;
  }

  protected drag(): void {
    if (this.isDragging) {
      this.container!.x = this.globalMousePositionRef.x;
      this.container!.y = this.globalMousePositionRef.y; // Should define offsets here so graphic doesn't "jump"
    }
  }

  addToStage() {
    this.configureGraphic();
    this.setupInteractivity();

    if (!this.container) {
      // This shouldn't happen, but in case configureGraphic fails
      throw new Error(
        "You must initialize the graphic object before adding it to the stage (call configureGraphic)"
      );
    } else {
      this.appReference.stage.addChild(this.container);
    }
  }
  // Configure the appearance of the drawable component of the record
  abstract configureGraphic(): void;
  // configure the specific behaviors
  abstract update(): void;
}
