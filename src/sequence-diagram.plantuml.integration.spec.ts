import { SequenceDiagram } from "./sequence-diagram";

describe("Sequence Diagram integration with PlantUML frontend", () => {
  it("matches expectated rendered source code for the simplest example", () => {
    const classicExample = new SequenceDiagram()
      .addActor("Alice")
      .addActor("Bob")
      .addMessage({ from: "Alice", to: "Bob", label: "Authentication Request" })
      .addMessage({
        from: "Bob",
        to: "Alice",
        label: "Authentication Response",
        dotted: true,
      });

    const renderedSource = renderDiagramToPlantUML(classicExample);

    expect(renderedSource).toMatchInlineSnapshot();
  });
});
