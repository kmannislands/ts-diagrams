import { Diagram } from "./diagram";
import { SequenceDiagram } from "./sequence-diagram";
import { Box } from "./sequence-diagram/box";
import { Participant } from "./sequence-diagram/participant";
import { SeqDiagramEntityType } from "./sequence-diagram/sequence-diagram-entities";
import { SequenceMessage } from "./sequence-diagram/sequence-message";
import { assertUnreachable, BrandedStr } from "./type-util";

type PlantUMLSource = BrandedStr<"PlantUMLSource">;
type PlantUMLFragment = BrandedStr<"PlantUMLFragment">;

type ParticipantAliasDict = Map<Participant<string>, string>;

function pumlFrag(frag: string): PlantUMLFragment {
  return frag as PlantUMLFragment;
}

function renderParticipant(
  participantAliases: ParticipantAliasDict,
  participant: Participant<string>,
  indent: number = 0
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

  return pumlFrag(participantSource.padStart(indent));
}

function renderMessage(
  participantAliases: ParticipantAliasDict,
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

  return pumlFrag(msgSource);
}

function* renderBoxFragments(
  box: Box<string>,
  participantAliases: ParticipantAliasDict
): Generator<PlantUMLFragment> {
  yield pumlFrag(`box ${box.boxName}`);
  yield* renderParticipants(box, participantAliases);
  yield pumlFrag(`end box`);
}

function* renderParticipants(
  diagram: SequenceDiagram<string>,
  participantAliases: ParticipantAliasDict
): Generator<PlantUMLFragment> {
  // declare participants in order
  // TODO overload isn't working...
  for (const entity of diagram.entities(
    SeqDiagramEntityType.Box,
    SeqDiagramEntityType.Participant
  )) {
    switch (entity.type) {
      case SeqDiagramEntityType.Participant:
        yield renderParticipant(participantAliases, entity);
        break;
      case SeqDiagramEntityType.Box:
        // Make box extend IParticipantContainer?
        yield* renderBoxFragments(entity, participantAliases);
        break;
      default:
        assertUnreachable(entity);
    }
  }
}

function* sequenceDiagramChunks(
  diagram: SequenceDiagram<string>
): Generator<PlantUMLFragment> {
  // There's really no need to parallelize this but this is the shared memory that would need special attention:
  const participantAliases: ParticipantAliasDict = new Map();

  yield* renderParticipants(diagram, participantAliases);

  // Add line break between sections
  yield "" as PlantUMLFragment;

  // declare messages in order
  for (const message of diagram.entities(SeqDiagramEntityType.Message)) {
    yield renderMessage(participantAliases, message);
  }

  yield "" as PlantUMLFragment;
}

function accumulateGenerator<YieldValue>(
  generator: Generator<YieldValue>
): YieldValue[] {
  const acc: YieldValue[] = [];

  for (const value of generator) {
    acc.push(value);
  }

  return acc;
}

function makePlantUmlSource(
  lines: PlantUMLFragment[],
  title?: string
): PlantUMLSource {
  const titleFragment = `@startuml ${title || ""}`;
  const closeUmlFragment = "@enduml";

  return [titleFragment, ...lines, closeUmlFragment].join(
    "\n"
  ) as PlantUMLSource;
}

export function sequenceDiagramToPuml(
  diagram: SequenceDiagram<string>,
  title?: string
): PlantUMLSource {
  const sourceStringFragments = accumulateGenerator(
    sequenceDiagramChunks(diagram)
  );

  return makePlantUmlSource(sourceStringFragments, title);
}

/**
 * @nb this is currently implemented as a recursive renderer and would bomb out with some level of
 * nesting. However, it's safe to assume there are larger problems if you have > max stack frame limit level
 * of nesting in your diagram (you ok bro?).
 */
export function renderDiagramToPlantUML(
  diagram: Diagram,
  title?: string
): PlantUMLSource {
  return sequenceDiagramToPuml(diagram, title);
}
