import { DiagramEntityType } from "../diagram";
import { Box } from "./box";
import { Participant, ParticipantType } from "./participant";
import {
  SequenceDiagramEntity,
  SequenceDiagramEntityMap,
} from "./sequence-diagram-entities";
import { SequenceMessage, SequenceMessageConfig } from "./sequence-message";

// Special empty token that *should not be exported from the library* used to satisfy initial conditions for
// str lit union types that
const EMPTY = Symbol("EMPTY");

type Empty = typeof EMPTY;

type BaseParticipantNames = string | Empty;

export const SequenceDiagramType = "Sequence" as const;

// TODO at risk of early optimization... build an index once
// function getInitialIndex(): DiagramEntityIndex {
//   const entityTypes = Object.values(DiagramEntityType);
//   return Object.fromEntries(entityTypes.map((entityType) => [entityType, {}]));
// }

type DefinedParticipantNames<ExistingNames extends BaseParticipantNames> =
  Exclude<ExistingNames, Empty>;

type NewSeqDiag<
  ExistingNames extends BaseParticipantNames,
  NewName extends string
> = SequenceDiagram<DefinedParticipantNames<ExistingNames> | NewName>;

export class SequenceDiagram<
  DiagramParticipantNames extends BaseParticipantNames = Empty
> {
  public readonly diagramType = SequenceDiagramType;

  // TODO create index lazily, at risk of early optimization
  // private entityIndex?: DiagramEntityIndex;

  constructor(
    private diagramEntities: SequenceDiagramEntity<
      DefinedParticipantNames<DiagramParticipantNames>
    >[] = []
  ) {}

  private withEntity<NewParticipantName extends string>(
    newEntity: SequenceDiagramEntity<NewParticipantName>
  ): NewSeqDiag<DiagramParticipantNames, NewParticipantName> {
    // TODO figure out index typing
    return new SequenceDiagram<
      DefinedParticipantNames<DiagramParticipantNames> | NewParticipantName
    >([...this.entities(), newEntity] as any);
  }

  public addParticipantInstance<ParticipantName extends string>(
    participant: Participant<ParticipantName>
  ): NewSeqDiag<DiagramParticipantNames, ParticipantName> {
    // TODO: figure out typing here... trouble with excluding Empty?
    return this.withEntity(participant);
  }

  public addParticipant<NewParticipantName extends string>(
    participantName: NewParticipantName,
    type?: ParticipantType | `${ParticipantType}`
  ): NewSeqDiag<DiagramParticipantNames, NewParticipantName> {
    const participant = new Participant(
      participantName,
      type as ParticipantType
    );

    return this.addParticipantInstance(participant);
  }

  public addActor<ActorName extends string>(
    actorName: ActorName
  ): NewSeqDiag<DiagramParticipantNames, ActorName> {
    const actor = new Participant(actorName, ParticipantType.Actor);
    return this.addParticipantInstance(actor);
  }

  public addMessage(
    msg: SequenceMessageConfig<Exclude<DiagramParticipantNames, Empty>>
  ): SequenceDiagram<DiagramParticipantNames> {
    const messageInstance = new SequenceMessage(msg);
    return this.withEntity(messageInstance);
  }

  public box<ParticipantNamesAfter extends string>(
    boxTitle: string,
    boxCb: (
      existingDiagram: SequenceDiagram<DiagramParticipantNames>
    ) => SequenceDiagram<ParticipantNamesAfter>
  ): NewSeqDiag<DiagramParticipantNames, ParticipantNamesAfter> {
    const boxedDiagramParticipants = boxCb(this);

    const box = new Box(boxTitle);

    return boxedDiagramParticipants.withEntity<ParticipantNamesAfter>(box);
  }

  // entities(): Generator<
  //   SequenceDiagramEntity<Exclude<DiagramParticipantNames, Empty>>
  // >;
  entities<EntityTypes extends DiagramEntityType[]>(
    ...entityTypes: EntityTypes
  ): Generator<SequenceDiagramEntityMap[EntityTypes[number]]>;
  public *entities(
    ...entityTypes: DiagramEntityType[]
  ): Generator<
    SequenceDiagramEntity<DefinedParticipantNames<DiagramParticipantNames>>
  > {
    const narrowEntities = entityTypes.length > 0;
    // TODO could iterate over a smaller list with a cached index. Heuristic based on expected usage pattern:
    // if one entity type is read on an instance, others are likely to. However, most instances are
    // unlikely to be read (since they're transient instances used in chaining).
    for (const entity of this.diagramEntities) {
      const isRequestedEntity = entityTypes.includes(entity.type);
      if (narrowEntities && !isRequestedEntity) {
        continue;
      }
      yield entity;
    }
  }
}