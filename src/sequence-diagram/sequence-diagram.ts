import {
  DiagramEntity,
  // DiagramEntityIndex,
  DiagramEntityType,
} from "../diagram";
import { Participant, ParticipantType } from "./participant";
import { SequenceDiagramEntity, SequenceDiagramEntityMap } from "./sequence-diagram-entities";
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

type DefinedParticipantNames<ExistingNames extends BaseParticipantNames> = Exclude<ExistingNames, Empty>;

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

  public addParticipantInstance<ParticipantName extends string>(
    participant: Participant<ParticipantName>
  ): NewSeqDiag<DiagramParticipantNames, ParticipantName> {
    const newEntities = [...this.diagramEntities, participant];
    // TODO: figure out typing here... trouble with excluding Empty?
    return new SequenceDiagram(newEntities as any);
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
    return new SequenceDiagram([...this.diagramEntities, messageInstance]);
  }

  entities(): Generator<DiagramEntity>
  entities<EntityType extends DiagramEntityType>(entityType: EntityType): Generator<SequenceDiagramEntityMap[EntityType]>
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
