import { Diagram, DiagramEntityType } from "./diagram";
import { SequenceDiagram, SequenceDiagramType } from "./sequence-diagram";
import { Participant } from "./sequence-diagram/participant";
import { SequenceMessage } from "./sequence-diagram/sequence-message";
import { assertUnreachable, BrandedStr } from "./type-util";

type PlantUMLSource = BrandedStr<"PlantUMLSource">;
type PlantUMLFragment = BrandedStr<"PlantUMLFragment">;

function renderParticipant(
  participantAliases: Map<Participant<string>, string>,
  participant: Participant<string>
): PlantUMLFragment {
  // TODO check for other illegal characters
  const needsAlias = participant.name.indexOf(" ") > 0;

  let alias = "";
  if (needsAlias) {
    // TODO how to efficiently determine the seq?
    alias = `${participant.subType}1`;

    participantAliases.set(participant, alias);
  }

  const participantSource = `${participant.subType} "${participant.name}"${
    alias && ` as ${alias}`
  }`;

  return participantSource as PlantUMLFragment;
}

function renderMessage(
  participantAliases: Map<Participant<string>, string>,
  message: SequenceMessage<string>
): PlantUMLFragment {
  // Resolve any aliases
  const fromParticipantName =
    message.from instanceof Participant
      ? participantAliases.get(message.from)
      : message.from;

  const toParticipantName =
    message.to instanceof Participant
      ? participantAliases.get(message.to)
      : message.to;

  const msgSource = `${fromParticipantName} ${
    message.dotted ? "-->" : "->"
  } ${toParticipantName} : ${message.label}`;

  return msgSource as PlantUMLFragment;
}

export function sequenceDiagramToPuml(
  diagram: SequenceDiagram,
  title?: string
): PlantUMLSource {
  const titleFragment = `@startuml ${title || ""}`;
  const participantAliases = new Map<Participant<string>, string>();
  const sourceStringFragments: PlantUMLFragment[] = [];

  // declare participants in order
  for (const participant of diagram.entities(DiagramEntityType.Participant)) {
    const participantPuml = renderParticipant(participantAliases, participant);
    sourceStringFragments.push(participantPuml);
  }

  // Add a line break between groups
  sourceStringFragments.push("" as PlantUMLFragment);

  // declare messages in order
  for (const message of diagram.entities(DiagramEntityType.Message)) {
    const msgSource = renderMessage(participantAliases, message);
    sourceStringFragments.push(msgSource);
  }

  sourceStringFragments.push("" as PlantUMLFragment);

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
