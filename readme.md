# Visualizer demo

This demo aims to provide "visualization" for mock data (In this case, fake Salesforce-style records), where records are presented as nodes that are linked visually with related records by rays, and mousing over a record displays its fields.

## Notes

Renamed the "SceneGraph" class to "ActorCollection." Pixi's app.stage is already a scene graph, so ActorCollection makes it more explicit what the class does.

Canvas doesn't resize on window resize. Might want to register an event that recalculates the scene on a window resize.

If records are loaded asynchronously, or we want the ability to fetch more records after initialization, then it is possible that a Contact will be loaded before the Account it is related to. If this is the case, Records need special handling for undefined or eventual references. One way to do it might be to check in the update loop to see if a related record is present and set the reference in a private member. That would be expensive in collections of large records, however. It could be delayed to only run at a longer interval (and not check if the reference is set). Or, better, it could respond to an event fired when a new record is loaded.

~~Trying to figure out how to make a Record a data holder and a drawable object. In Record, I have two different interfaces for Accounts and Contacts. I could make a Drawable interface and try to compose them. Another idea I had was to create a concrete class that segregates the drawing properties and data properties into sub collections called Record.data amd Record.graphic. Or, I could make a new interface or class that represents drawing logic, have two instances of it (prototypes, actually) and assign it as a private member of Record, and then it's assigned at record initialization. I'm still undecided as to which one to attempt.~~ (done)

OK, I've managed to get the records drawn as their shape representations. The code needs cleaned up bad. First, move the createRecordActors function in Scene to a factory class to manage the logic better. This will help implement asynchronous loading because the factory can stay initialized and listen as an observer to a hypothetical new record loading event from Connection. (Partially done, but I forgot that I wanted to do this so I didn't implement it like this... Have to go back and revisit it)

~~In Record.ts, the RecordActor class should be moved to its own file. It also needs cleaned up.~~ (Done)

Mouse over events are working. The records will log their data to the console when moused over. This will be changed to showing an abbreviated tooltip (their id and name) and then a click will bring up the full window. Also, when mousing over, the line drawn to related records should glow or pulsate.

~~There's a bug with the contact records where the mouse over detection collision is not in the same position as their drawn shape on the screen. It's offset to the left for some reason. No idea why yet.~~ (Fixed)

There's no demonstration of async record loading yet. Should add a button that grabs more data and spawns more records just to show this is possible.

Code has gotten very messy. Once basic functionality is in, need to do a full code quality pass to reduce length of methods, consolidate methods together, reorganize source files (RecordActor should be its own class in /actors, etc), refactor some naked functions into better constructed classes, remove unneeded comments, and write tests for everything.

Add click + drag functionality to move records around and then figure out how to recalculate related record line-drawing behavior on each move (event).

I'm starting to regret how I subclassed RecordActor into ContactActor, AccountActor etc. It adds more classes when instead, I could refactor this so that RecordActor (as it already does) has members .graphic and .data. .graphic can be cloned from a pre-defined prototype at instantiation. Then to make the behaviors different, add a member that is a "behaviors" array (ie, an array of functions) to iterate through in the update method. Then only RecordActor is required, without any subclassing, reducing the number of classes.

I would like to add a Loading scene that shows an animation until all assets are loaded in the scene and ready to display, to prevent pop in on initialize.

Click and drag is working, although it was a bitch to pass the global mouse position to the constructors of the record classes. A reference had to be passed from the scene, to the factory, to the factory method generic that creates the records, to the record constructors. Way too many references passed down the chain and I wish there's (and maybe there is) some way to globally access mouse position without having to pass a reference so many times.

My plan next is to create a new collection of actors called "relationship lines" that will handle all the lines drawn between records as opposed to trying to encapsulate them within each Record class, the Record class is already a mess and trying to store references between them will create even more spaghetti.

## Neat Ideas
1. When the mouse moves close to a Record node, it will expand in size based on its proximity to the cursor. Then contract when the cursor moves away
2. Record nodes will bob up and down or otherwise wiggle or something cool
3. Collision between record nodes. If one expands, it can push the others out of the way