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

  // Fix type annotation here
  protected hitAreaOffset: number; // set it before setupInteractivity
  protected hitAreaRadius: number;

  constructor(appReference: PixiJs.Application, recordData: MockRecord) {
    this.appReference = appReference;

    this.graphic = new PixiJs.Graphics();

    this.recordData = Object.assign({} as MockRecord, recordData);
    // the spread operator will also shallow copy the props, but I think .assign is more explicit
    // this.recordData = { ...recordData };

    // this.setupInteractivity();
  }

  // llm slop, write my own later ------------------
  //#region llmslop
  protected setupInteractivity(): void {
    if (this.graphic) {
      // Enable interactivity
      this.graphic.eventMode = "dynamic";
      this.graphic!.cursor = "pointer";

      this.graphic.hitArea = new PixiJs.Rectangle(
        this.graphic.x - this.hitAreaOffset,
        this.graphic.y - 15,
        this.hitAreaRadius,
        this.hitAreaRadius
      );

      // Add pointer events
      this.graphic.on("pointerover", this.onPointerOver.bind(this));
      this.graphic.on("pointerout", this.onPointerOut.bind(this));
      // on click
      this.graphic.on("pointerdown", this.onPointerDown.bind(this));
    }
  }

  protected onPointerOver(): void {
    console.log(`Mouse over record: ${this.recordData.Id}`);
    this.graphic!.scale = 1.2;
  }

  protected onPointerOut(): void {
    // Reset appearance
    this.graphic!.scale = 1.0;
  }

  protected onPointerDown(): void {
    console.log(`Clicked record: ${this.recordData.Id}`);
    console.log("Record details:", this.recordData);
  }
  //#endregion
  // end llm slop ---------------------------------------

  addToStage() {
    this.configureGraphic();
    this.setupInteractivity();

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
  // The super call is unnecessary- if the constructor is absent, parent constructor is called by defualt
  constructor(appReference: PixiJs.Application, recordData: any) {
    super(appReference, recordData);
  }

  configureGraphic() {
    // Would be nice to define all the properties in an object instead of inline
    // maybe oughta stop throwing around non-null assertions willy nilly
    this.graphic!.ellipse(this.graphic!.x, this.graphic!.y, 20, 20);
    this.graphic!.fill(0x55d6f5);

    this.hitAreaOffset = 15;
    this.hitAreaRadius = 30;

    this.graphic!.pivot.x = 10;
    this.graphic!.pivot.y = 10;
  }

  update() {
    return;
  }
}

export class ContactActor extends RecordActor {
  private sinMod: number = 0;
  private glowFilter: PixiJs.ColorMatrixFilter | null = null;
  private pulseDirection: number = 1;
  private pulseValue: number = 0;

  constructor(appReference: PixiJs.Application, recordData: any) {
    super(appReference, recordData);
  }

  configureGraphic() {

    this.graphic!.fill(0x6bf334);
    this.graphic!.stroke({width: 2, color:0x4da828}); // Add border
    this.graphic!.roundRect(0, 0, 24, 24, 3.2); // Slightly larger with rounded corners
    this.graphic!.endFill();

    // gradient effect
    const gradientGraphic = new PixiJs.Sprite(PixiJs.Texture.WHITE);
    gradientGraphic.width = 24;
    gradientGraphic.height = 24;

    gradientGraphic.tint = 0xffffff;
    gradientGraphic.alpha = 0.3;

    // Add a mask to make it rounded like our base shape
    const gradientMask = new PixiJs.Graphics();
    gradientMask.fill(0xffffff);
    gradientMask.roundRect(0, 0, 24, 24, 6);
    gradientMask.endFill();

    gradientGraphic.mask = gradientMask;
    this.graphic!.addChild(gradientMask);

    gradientGraphic.height = 12; // cover top half

    // glow fx
    const blurFilter = new PixiJs.BlurFilter({strength: 0.2, quality: 1});
    this.glowFilter = new PixiJs.ColorMatrixFilter();
    this.glowFilter.brightness(1.2, false);

    this.graphic!.filters = [blurFilter, this.glowFilter];
    this.graphic!.addChild(gradientGraphic);

    this.graphic!.pivot.x = 12;
    this.graphic!.pivot.y = 12;

    // rotation
    this.graphic!.angle = Math.random() * 10 - 5;
    this.hitAreaOffset = 0;
    this.hitAreaRadius = 32;

    // mouse events
    this.graphic!.eventMode = "static";

    this.graphic!.on("pointerover", () => {
      this.graphic!.scale.set(1.15, 1.15);
      if (this.glowFilter) {
        this.glowFilter.brightness(1.5, false);
      }
    });

    this.graphic!.on("pointerout", () => {
      this.graphic!.scale.set(1, 1);
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
    this.graphic!.position.y =
      this.graphic!.position.y + Math.sin(this.sinMod) * bobAmount;
    this.graphic!.position.x += Math.cos(this.sinMod * 0.7) * 0.2 * swayAmount;

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
        baseBrightness + this.pulseValue * pulseAmount, false
      );
    }
  }
}
