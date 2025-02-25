import * as PixiJs from "pixi.js"

export interface Actor {
    appReference: PixiJs.Application;
    update: () => void;
    addToStage: () => void;
}