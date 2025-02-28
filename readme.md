# Visualizer demo

This demo aims to provide "visualization" for mock data (In this case, fake Salesforce-style records), where records are presented as nodes that are linked visually with related records by rays, and mousing over a record displays its fields.

## Notes

Renamed the "SceneGraph" class to "ActorCollection." Pixi's app.stage is already a scene graph, so ActorCollection makes it more explicit what the class does.

Canvas doesn't resize on window resize. Might want to register an event that recalculates the scene on a window resize.

If records are loaded asynchronously, or we want the ability to fetch more records after initialization, then it is possible that a Contact will be loaded before the Account it is related to. If this is the case, Records need special handling for undefined or eventual references. One way to do it might be to check in the update loop to see if a related record is present and set the reference in a private member. That would be expensive in collections of large records, however. It could be delayed to only run at a longer interval (and not check if the reference is set). Or, better, it could respond to an event fired when a new record is loaded.

Trying to figure out how to make a Record a data holder and a drawable object. In Record, I have two different interfaces for Accounts and Contacts. I could make a Drawable interface and try to compose them. Another idea I had was to create a concrete class that segregates the drawing properties and data properties into sub collections called Record.data amd Record.graphic. Or, I could make a new interface or class that represents drawing logic, have two instances of it (prototypes, actually) and assign it as a private member of Record, and then it's assigned at record initialization. I'm still undecided as to which one to attempt.

## Neat Ideas
1. When the mouse moves close to a Record node, it will expand in size based on its proximity to the cursor. Then contract when the cursor moves away
2. Record nodes will bob up and down or otherwise wiggle or something cool
3. Collision between record nodes. If one expands, it can push the others out of the way