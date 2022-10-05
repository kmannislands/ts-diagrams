import { Diagram } from "./diagram";
import { SequenceDiagram, SequenceDiagramType } from "./sequence-diagram";
import { assertUnreachable, BrandedStr } from "./type-util";

type PlantUMLSource = BrandedStr<"PlantUMLSource">;

export function sequenceDiagramToPuml(
  diagram: SequenceDiagram,
  title?: string
): PlantUMLSource {
  // declare participants in order
  // declare messages in order
  // open/close @startUml
}

export function renderDiagramToPlantUML(
  diagram: Diagram,
  title?: string
): PlantUMLSource {
  switch (diagram.diagramType) {
    case SequenceDiagramType:
      return sequenceDiagramToPuml(diagram, title);
    default:
      assertUnreachable(diagram.diagramType);
  }
}
