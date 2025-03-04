// the visual representation and the data retrieved from an endpoint

// Records are visually represented as "nodes" or shapes on the canvas with rays drawn to related records

// should implement a mouseover behavior that displays a dialogue box that displays the record's fields

import * as PixiJs from "pixi.js";
import { Actor } from "./Actor";
import { Tooltip } from "../actors/Tooltip";

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
  container: PixiJs.Container | undefined;
  protected recordData: MockRecord;

  protected isDragging: boolean = false;
  protected globalMousePositionRef: { x: number; y: number };

  protected tooltip: Tooltip;

  // Fix type annotation here
  protected hitAreaOffset: number; // set it before setupInteractivity
  protected hitAreaRadius: number;

  constructor(appReference: PixiJs.Application, recordData: MockRecord, mousePos: {x: number, y: number}) {
    this.appReference = appReference;

    this.container = new PixiJs.Container();

    this.recordData = Object.assign({} as MockRecord, recordData);
    // the spread operator will also shallow copy the props, but I think .assign is more explicit
    // this.recordData = { ...recordData };

    this.globalMousePositionRef = mousePos;

    // add the box that displays record data on hover

    this.tooltip = new Tooltip(this.recordData, this.container)
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

  // define the behavior for when mousing over the record (popping up a tool tip with its data)
  // on mouse over, showTooltip: () => void;
}

export class AccountActor extends RecordActor {
  // private glowFilter: PixiJs.ColorMatrixFilter;
  private sinMod: number;

  // The super call is unnecessary- if the constructor is absent, parent constructor is called by defualt
  constructor(appReference: PixiJs.Application, recordData: any, mousePos: {x: number, y: number}) {
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

export class ContactActor extends RecordActor {
  private sinMod: number;
  private glowFilter: PixiJs.ColorMatrixFilter | null = null;
  private pulseDirection: number = 1;
  private pulseValue: number = 0;

  constructor(appReference: PixiJs.Application, recordData: any, mousePos: {x: number, y: number}) {
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
    this.container!.angle = Math.random() * 10 - 5;
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
