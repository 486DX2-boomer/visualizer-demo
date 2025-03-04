import * as PixiJs from "pixi.js";
import { MockRecord } from "../classes/Record";

export class Tooltip {
  // @ts-ignore
  private parent: PixiJs.Container;
  public container: PixiJs.Container;
  private recordData: MockRecord;
  private offsetX: number = -40;
  // @ts-ignore
  private offsetY: number = -130;

  constructor(recordData: MockRecord, parent: PixiJs.Container) {
    this.parent = parent;
    this.container = new PixiJs.Container();
    this.recordData = recordData;

    // const box = new PixiJs.Graphics();
    // box.rect(
    //   this.parent.x + this.offsetX,
    //   this.parent.y + this.offsetY,
    //   133,
    //   100
    // );
    // box.fill(0x122327);
    // this.container.addChild(box);

    this.container.visible = false;

    // serialize the record data into a string and then format it to fit the box
    let dataString = "";
    for (let key in this.recordData) {
        dataString += key.toString();
        dataString += ": ";
        dataString += ((this.recordData as any)[key]).toString();
        dataString += "\n";
    };

    const boxTextStyle = new PixiJs.TextStyle({fontSize: 14, fill: "white",
        dropShadow: {
            blur: 0,
            distance: 2
        }
    })
    const boxText = new PixiJs.Text({text: dataString, style: boxTextStyle});
    boxText.position.x -= this.offsetX;

    this.container.addChild(boxText);
  }

  public show() {
    this.container.visible = true;
  }

  public hide() {
    this.container.visible = false;
  }

  public update() {

  }
}
