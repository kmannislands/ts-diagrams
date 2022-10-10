# ts-diagrams (better name TBD)

This repo contains experiments with creating software diagrams using typescript. The goal of the library is to
experiment with an alternative syntax for writing diagrams-as-code.

Here's a simple example:

```typescript
new SequenceDiagram()
  .addActor("Alice")
  .addActor("Bob")
  .addMessage({ from: "Alice", to: "Bob", label: "Hello Bob!" });
```

`ts-diagrams` makes extensive use of the typescript type system to make writing diagrams a pleasure. From the
previous example, `'Alice'` and `'Bob'` are known to be participants in the diagram and the `from` and `to`
properties of the `addMessage` parameter are type checked.

## Relationship with PlantUML

This project is heavily inspired by [PlantUML](https://plantuml.com/). PlantUML is a very mature and
fully-featured solution that can produce just about any diagram you can think of (and probably a few you
haven't imagined yet). It is common to work with PlantUML for years and still occasionally discover new
features. In short, PlantUML is an amazing tool for communicating about software that is the main inspiration
for this library.

`ts-diagrams` is probably best explained in relationship to PlantUML.

### Strictness, Syntax, Ambiguity

- Esoteric syntax - another syntax to learn
  - Styling
- PlantUML is very permissive by design. This can make "refactoring" of diagrams difficult. It is common to
  use simple 'find and replace' operations to perform renames in diagrams. With `ts-diagrams`
- Ambiguity over what sort of diagram is being described
- Macros can be complicated
- Diagrams go "out of sync" with code easily

### Aliases

PlantUML uses aliases to make referencing diagram entities with long/otherwise inconvenient names more
ergonomic.

For example, in PlantUML:

```puml
participant "I have a really\nlong name" as L

' L is now used to reference the participant with the long name:
L -> L : Self-call
```

As `ts-diagrams` is a typescript-first solution, we shouldn't need the complexity/indirection of aliases.
Instead, all API's should accept references in place of a string literal name.

For example, the aforementioned PlantUML diagram can be expressed with `ts-diagrams` as:

```typescript
const longNameParticipant = new Participant("I have a really\nlong name");

new SequenceDiagram()
  .addParticipantInstance(longNameParticipant)
  .addMessage({
    from: longNameParticipant,
    to: longNameParticipant,
    label: "Self-call",
  });
```

Notice that no alias was ever declared by the user. When generating PUML with the PlantUML front-end, aliases
are safely and consistently resolved internally and used in generated code to reasonably approximate PUML
written by a human.

## Goals

Provide equivalents for a subset of PlantUML:

- Diagrams:
  - Sequence
  - Class
  - Entity-Relationship
  - State machine
- Features:
  - Notes
  - Styling

Accommodate multiple front-ends (targets for rendering):

- PUML source code (to be rendered by a standard PlantUML server)
- (eventually) a "universal" js or js + WASM with the goal of rendering diagrams without a JVM dependency (ie:
  in the browser and in node/deno/whatever runtime supports WASM + ES2020).
