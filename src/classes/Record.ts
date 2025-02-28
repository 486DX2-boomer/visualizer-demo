// the visual representation and the data retrieved from an endpoint

// Records are visually represented as "nodes" or shapes on the canvas with rays drawn to related records

// should implement a mouseover behavior that displays a dialogue box that displays the record's fields

import * as PixiJs from "pixi.js";
import { Actor } from "./Actor";
import { record } from "zod";

export interface MockRecord {
  Id: string;
  name: string;
  createdDate: string;
  type: string; // for discriminating if necessary
}

// interface RecordRelationship {
//   relatedRecordId: string;
//   relatedObjectType: string;
//   fieldName: string;
//   relationshipType: RelationshipType;

//   // Optional metadata for visualization
//   visualMetadata?: {
//     lineStyle?: "solid" | "dashed" | "dotted";
//     lineColor?: string;
//     lineThickness?: number;
//     label?: string;
//   };
// }

export interface Account extends MockRecord {
  industry: string;
  numberOfEmployees: number;
  annualRevenue: number;
  website: string;
  phone: string;
}

export interface Contact extends MockRecord {
  accountId: string; // Relationship field (to Account object)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
}

// interface Opportunity extends mockRecord {

// }

// export unneeded here?
// export interface RecordActor extends MockRecord, Actor {
//     sprite?: PixiJs.Sprite;
//     shape?: any; // if I decide to make the accounts circles, squares, etc
//     // relationship?: RecordRelationship; // Don't know how to implement the relationship drawing yet
// }

// RecordActor separates the graphical representation and the data into different members
abstract class RecordActor implements Actor {
  appReference: PixiJs.Application;
  graphic: PixiJs.Graphics | undefined;
  protected recordData: MockRecord;

  constructor(appReference: PixiJs.Application, recordData: MockRecord) {
    this.appReference = appReference;

    this.graphic = new PixiJs.Graphics();

    this.recordData = Object.assign({} as MockRecord, recordData);
    // the spread operator will also shallow copy the props, but I think .assign is more explicit
    // this.recordData = { ...recordData };

    this.setupInteractivity();
  }

  // llm slop, write my own later ------------------
  protected setupInteractivity(): void {
    if (this.graphic) {
      // Enable interactivity
      this.graphic.eventMode = "static";

      // Add a hitArea (area that responds to events)
      // Assuming your graphic is a rectangle/circle of some size
      // Adjust the size as needed based on your actual graphics
      this.graphic.hitArea = new PixiJs.Rectangle(0, 0, 50, 50);

      // Add pointer events
      this.graphic.on("pointerover", this.onPointerOver.bind(this));
      this.graphic.on("pointerout", this.onPointerOut.bind(this));

      // Optional: Add click event too
      this.graphic.on("pointerdown", this.onPointerDown.bind(this));
    }
  }

  protected onPointerOver(): void {
    console.log(`Mouse over record: ${this.recordData.Id}`);
    // Optionally change appearance on hover
    this.graphic!.alpha = 0.8; // Slightly transparent
  }

  protected onPointerOut(): void {
    // Reset appearance
    this.graphic!.alpha = 1;
  }

  protected onPointerDown(): void {
    console.log(`Clicked record: ${this.recordData.Id}`);
    console.log("Record details:", this.recordData);
  }
  // end llm slop ---------------------------------------

  addToStage() {
    this.configureGraphic();

    if (!this.graphic) {
      // This shouldn't happen, but in case configureGraphic fails
      throw new Error(
        "You must initialize the graphic object before adding it to the stage (call configureGraphic)"
      );
    } else {
      this.appReference.stage.addChild(this.graphic);
    }
  }
  // Configure the appearance of the drawable component of the record
  abstract configureGraphic(): void;
  // configure the specific behaviors
  abstract update(): void;

  // define the behavior for when mousing over the record (popping up a tool tip with its data)
  // on mouse over, showTooltip: () => void;
}

export class AccountActor extends RecordActor {
  constructor(appReference: PixiJs.Application, recordData: any) {
    super(appReference, recordData);
  }

  configureGraphic() {
    // this.graphic = new PixiJs.Graphics();
    this.graphic!.x = 10;
    this.graphic!.y = 10;
    // maybe you oughta stop throwing around non-null assertions willy nilly??
    this.graphic!.ellipse(this.graphic!.x, this.graphic!.y, 10, 10);
    this.graphic!.fill(0xc34288);
  }

  update() {
    return;
  }
}

export class ContactActor extends RecordActor {
  constructor(appReference: PixiJs.Application, recordData: any) {
    super(appReference, recordData);
  }
  configureGraphic() {
    // this.graphic = new PixiJs.Graphics();
    this.graphic!.x = 100;
    this.graphic!.y = 100;
    this.graphic!.rect(this.graphic!.x, this.graphic!.y, 12, 12);
    this.graphic!.fill(0x7ba48a);
  }

  update() {
    return;
  }
}
