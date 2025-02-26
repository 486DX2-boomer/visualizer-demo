# Visualizer demo

This demo aims to provide "visualization" for mock data (In this case, fake Salesforce-style records), where records are presented as nodes that are linked visually with related records by rays, and mousing over a record displays its fields.

## Notes

Renamed the "SceneGraph" class to "ActorCollection." Pixi's app.stage is already a scene graph, so ActorCollection makes it more explicit what the class does.

## Neat Ideas
1. When the mouse moves close to a Record node, it will expand in size based on its proximity to the cursor. Then contract when the cursor moves away
2. Record nodes will bob up and down or otherwise wiggle or something cool
3. Collision between record nodes. If one expands, it can push the others out of the way