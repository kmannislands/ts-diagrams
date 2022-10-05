import { SequenceDiagram } from "./sequence-diagram";

// Example syntax:
new SequenceDiagram()
  .addActor("Alice")
  .addActor("Bob")
  .addMessage({ from: "Alice", to: "Bob", label: "Authentication Request" })
  .addMessage({
    from: "Bob",
    to: "Alice",
    label: "Authentication Response",
    dotted: true,
  });
