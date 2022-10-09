import { Diagram, DiagramEntityType } from "./diagram";
import { SequenceDiagram, SequenceDiagramType } from "./sequence-diagram";
import { assertUnreachable, BrandedStr } from "./type-util";

type PlantUMLSource = BrandedStr<"PlantUMLSource">;

export function sequenceDiagramToPuml(
  diagram: SequenceDiagram,
  title?: string
): PlantUMLSource {
  const titleFragment = `@startuml ${title}`;
  const sourceStringFragments: string[] = [];

  // declare participants in order
  for (const participant of diagram.entities(DiagramEntityType.Participant)) {
    const participantSource = `participant "${participant.name}"`;
    sourceStringFragments.push(participantSource);
  }

  // declare messages in order
  for (const message of diagram.entities(DiagramEntityType.Message)) {
    const { from, to, label } = message.meta;
    const msgSource = `${from} -> ${to} : ${label}`;
    sourceStringFragments.push(msgSource);
  }

  const closeUmlFragment = "@enduml";

  // open/close @startUml
  return [titleFragment, ...sourceStringFragments, closeUmlFragment].join(
    "\n"
  ) as PlantUMLSource;
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
