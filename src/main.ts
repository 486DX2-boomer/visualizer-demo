import * as PixiJs from "pixi.js";
import { Scene } from "./classes/Scene"

(async () => {
  const app = new PixiJs.Application();

  await app.init({ background: "#2c3335", resizeTo: window, antialias: true });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const scene = new Scene(app)
  await scene.load();

})();
