import { ActorCollection } from "./ActorCollection";
import { AccountActor, ContactActor } from "./Record";
import * as PixiJs from "pixi.js";

export class RecordActorFactory {
  private app: PixiJs.Application;
  private actors: ActorCollection;
  private screenWidth: number;
  private screenHeight: number;
  private padding: number = 50;

  constructor(
    appReference: PixiJs.Application,
    actorCollection: ActorCollection,
    padding: number = 50
  ) {
    this.app = appReference;
    this.actors = actorCollection;
    this.screenWidth = this.app.screen.width;
    this.screenHeight = this.app.screen.height;
    this.padding = padding;
  }

  private generateCoordField(
    corner: "bottomLeft" | "topRight",
    count: number
  ): Array<{ x: number; y: number }> {
    const points: Array<{ x: number; y: number }> = [];
    const minDist = 50; // Min spacing between points

    const startX =
      corner === "bottomLeft" ? this.padding : this.screenWidth - this.padding;
    const startY =
      corner === "bottomLeft" ? this.screenHeight - this.padding : this.padding;
    points.push({
      x: startX + (corner === "bottomLeft" ? 20 : -20),
      y: startY + (corner === "bottomLeft" ? -20 : 20),
    });

    // Try to generate enough points, but abort if it takes too long
    let tries = 0;
    const maxTries = count * 3;

    while (points.length < count && tries < maxTries) {
      tries++;

      // Pick a random existing point to branch from
      const baseIndex = Math.floor(Math.random() * points.length);
      const base = points[baseIndex];

      // constraining the angles
      // I don't understand this part, I don't understand pi
      let minAngle, maxAngle;
      if (corner === "bottomLeft") {
        minAngle = -Math.PI * 0.75;
        maxAngle = Math.PI * 0.25;
      } else {
        minAngle = Math.PI * 0.25;
        maxAngle = Math.PI * 1.25;
      }

      const angle = minAngle + Math.random() * (maxAngle - minAngle);
      const dist = 50 + Math.random() * 20 + tries / 10;

      let x = base.x + Math.cos(angle) * dist;
      let y = base.y + Math.sin(angle) * dist;

      // constrain to screen bounds
      x = Math.max(this.padding, Math.min(this.screenWidth - this.padding, x));
      y = Math.max(this.padding, Math.min(this.screenHeight - this.padding, y));

      // prevent overlapping
      let tooClose = false;
      for (let i = 0; i < points.length; i++) {
        const dx = points[i].x - x;
        const dy = points[i].y - y;
        const distSq = dx * dx + dy * dy;
        if (distSq < minDist * minDist) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        points.push({ x, y });
      }
    }

    // this is a fallback in case we somehow didn't get enough coords
    if (points.length < count) {
      const need = count - points.length;
      points.push(...this.makeFillerCoords(corner, need));
    }

    return points.slice(0, count);
  }

  // fallback in case we somehow didn't get enough coordinates
  private makeFillerCoords(
    corner: "bottomLeft" | "topRight",
    count: number
  ): Array<{ x: number; y: number }> {
    const points = [];

    const centerX =
      corner === "bottomLeft"
        ? this.padding * 3
        : this.screenWidth - this.padding * 3;
    const centerY =
      corner === "bottomLeft"
        ? this.screenHeight - this.padding * 3
        : this.padding * 3;

    for (let i = 0; i < count; i++) {
      const angle = 0.5 * i;
      const radius = 10 * Math.sqrt(i);

      // define direction
      const xDir = corner === "bottomLeft" ? 1 : -1;
      const yDir = corner === "bottomLeft" ? -1 : 1;

      // math that I do not understand at all. I got a D in Algebra ok
      let x = centerX + xDir * radius * Math.cos(angle);
      let y = centerY + yDir * radius * Math.sin(angle);

      x += Math.random() * 20 - 10;
      y += Math.random() * 20 - 10;

      // constrain to screen bounds
      x = Math.max(this.padding, Math.min(this.screenWidth - this.padding, x));
      y = Math.max(this.padding, Math.min(this.screenHeight - this.padding, y));

      points.push({ x, y });
    }

    return points;
  }

  private createActors<T>(
    ActorType: new (app: PixiJs.Application, data: any) => T,
    records: any[],
    coords: Array<{ x: number; y: number }>
  ): void {
    const count = Math.min(records.length, coords.length);

    for (let i = 0; i < count; i++) {
      const actor = new ActorType(this.app, records[i]);
      this.actors.addActor(actor as any);
      (actor as any).container.position.set(coords[i].x, coords[i].y);
    }
  }

  createRecordActors(response: any[]): void {
    if (!response || response.length === 0) {
      console.warn("No records to create actors from");
      return;
    }

    // Split records by type
    // Still haven't made this generic enough... should be able to handle any record type
    const accounts = [];
    const contacts = [];

    for (let i = 0; i < response.length; i++) {
      const r = response[i];
      if (r.type === "Account") {
        accounts.push(r);
      } else if (r.type === "Contact") {
        contacts.push(r);
      }
    }

    const accountCoords = this.generateCoordField(
      "bottomLeft",
      accounts.length
    );
    const contactCoords = this.generateCoordField("topRight", contacts.length);

    this.createActors(AccountActor, accounts, accountCoords);
    this.createActors(ContactActor, contacts, contactCoords);
  }
}
