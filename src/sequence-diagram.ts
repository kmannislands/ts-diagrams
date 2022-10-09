import { DiagramEntity, DiagramEntityIndex, DiagramEntityType } from "./diagram";

interface SequenceMessage<ParticipantName extends BaseParticipantNames> {
  from: ParticipantName;
  to: ParticipantName;
  label: string;

  dotted?: boolean;
}

// Special empty token that *should not be exported from the library* used to satisfy initial conditions for
// str lit union types that
const EMPTY = Symbol("EMPTY");

type Empty = typeof EMPTY;

type BaseParticipantNames = string | Empty;

export const SequenceDiagramType = "Sequence" as const;

function getInitialIndex(): DiagramEntityIndex {
  const entityTypes = Object.values(DiagramEntityType);
  return Object.fromEntries(entityTypes.map((entityType) => [entityType, {}]));
}

export class SequenceDiagram<
  DiagramParticipantNames extends BaseParticipantNames = Empty
> {
  public readonly diagramType = SequenceDiagramType;

  // TODO create index lazily, at risk of early optimization
  // private entityIndex?: DiagramEntityIndex;

  constructor(private diagramEntities: DiagramEntity[] = []) {}

  public addActor<ActorName extends string>(
    actorName: ActorName
  ): SequenceDiagram<DiagramParticipantNames | ActorName> {
    const newActorEntity: DiagramEntity = {
      type: DiagramEntityType.Participant,
      name: actorName,
    };

    return new SequenceDiagram([...this.diagramEntities, newActorEntity]);
  }

  public addMessage(
    msg: SequenceMessage<DiagramParticipantNames>
  ): SequenceDiagram<DiagramParticipantNames> {
    const newMsgEntity: DiagramEntity = {
      type: DiagramEntityType.Message,
      // TODO name -> id?
      name: msg.label,
      meta: {
        ...msg,
      },
    };

    return new SequenceDiagram([...this.diagramEntities, newMsgEntity]);
  }

  public *entities(entityType?: DiagramEntityType): Generator<DiagramEntity> {
    // TODO could iterate over a smaller list with a cached index. Heuristic based on expected usage pattern:
    // if one entity type is read on an instance, others are likely to. However, most instances are
    // unlikely to be read (since they're transient instances used in chaining).
    for (const entity of this.diagramEntities) {
      if (entityType && entity.type !== entityType) {
        continue;
      }
      yield entity;
    }
  }
}
