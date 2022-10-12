import { DiagramType, Empty, IDiagram } from "../diagram";
import { Box } from "./box";
import { Participant, ParticipantType } from "./participant";
import {
  BaseParticipantNames,
  DefinedParticipantNames,
  SeqDiagramEntityType,
  SequenceDiagramEntity,
  SequenceDiagramEntityMap,
} from "./sequence-diagram-entities";
import { IParticipantContainer } from "./IParticipantContainer";
import { SequenceMessage, SequenceMessageConfig } from "./sequence-message";
import { EntityContainer } from "../entity-container";

type NewSeqDiag<
  ExistingNames extends BaseParticipantNames,
  NewName extends string
> = SequenceDiagram<DefinedParticipantNames<ExistingNames> | NewName>;

export class SequenceDiagram<
  DiagramParticipantNames extends BaseParticipantNames = Empty
> implements
    IParticipantContainer<DiagramParticipantNames>,
    IDiagram<DiagramType.SequenceDiagram>
{
  public readonly diagramType = DiagramType.SequenceDiagram;

  constructor(
    private container: EntityContainer<
      SeqDiagramEntityType,
      SequenceDiagramEntity<string>,
      SequenceDiagramEntityMap
    > = new EntityContainer([])
  ) {}

  public addParticipantInstance<ParticipantName extends string>(
    participant: Participant<ParticipantName>
  ): NewSeqDiag<DiagramParticipantNames, ParticipantName> {
    // TODO: figure out typing here... trouble with excluding Empty?
    const newContainer = this.container.withEntity(participant);

    return new SequenceDiagram(newContainer);
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
    const newContainer = this.container.withEntity(messageInstance);

    return new SequenceDiagram(newContainer);
  }

  public box<ParticipantNamesAfter extends string>(
    boxTitle: string,
    boxCb: (
      existingDiagram: Box<Exclude<DiagramParticipantNames, Empty>>
    ) => Box<ParticipantNamesAfter>
  ): NewSeqDiag<DiagramParticipantNames, ParticipantNamesAfter> {
    const emptyBox = new Box<Exclude<DiagramParticipantNames, Empty>>(boxTitle);

    const filledBox = boxCb(emptyBox);
    const newContainer = this.container.withEntity(filledBox);

    return new SequenceDiagram(newContainer);
  }

  // TODO can type explicitly once interfaces are stable
  public entities = this.container.entities.bind(this.container);
}
