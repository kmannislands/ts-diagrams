import { describe, it, expect } from "@jest/globals";
import { DiagramEntityType } from "./diagram";
import { SequenceDiagram } from "./sequence-diagram/sequence-diagram";

describe("Sequence Diagram", () => {
  it("can iterate over multiple entity types", () => {
    const kitchenSinkDiagram = new SequenceDiagram()
      .addParticipant("Foo")
      .addActor("Bar")
      .addMessage({ from: "Foo", to: "Bar" })
      .box("box", (d) => d);

    // Only participants
    expect(
        kitchenSinkDiagram.entities(DiagramEntityType.Participant)
    );
    // No box 
    expect(
        kitchenSinkDiagram.entities(DiagramEntityType.Participant, DiagramEntityType.Message)
    );
    // Everything
    expect(kitchenSinkDiagram.entities());
  });
});
