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

export const SequenceDiagramType = 'Sequence' as const;

export class SequenceDiagram<
  DiagramParticipantNames extends BaseParticipantNames = Empty
> {
  public readonly diagramType = SequenceDiagramType;

  constructor(_participants?: DiagramParticipantNames) {}

  public addActor<ActorName extends string>(
    _actorName: ActorName
  ): SequenceDiagram<DiagramParticipantNames | ActorName> {
    return this;
  }

  public addMessage(
    _msg: SequenceMessage<DiagramParticipantNames>
  ): SequenceDiagram<DiagramParticipantNames> {
    return new SequenceDiagram();
  }
}
