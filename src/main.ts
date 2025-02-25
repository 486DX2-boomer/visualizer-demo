import * as PixiJs from "pixi.js";
import { Scene } from "./classes/Scene"

(async () => {
  // Create a new application
  const app = new PixiJs.Application();

  // Initialize the application
  await app.init({ background: "#2c3335", resizeTo: window, antialias: true });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  let scene = new Scene(app) // If declared with let, we can switch the scene later.
  await scene.load();

})();
