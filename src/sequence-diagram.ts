interface SequenceMessage<ParticipantName extends BaseParticipantNames> {
  from: ParticipantName;
  to: ParticipantName;
  label: string;

  dotted?: boolean;
}

const EMPTY = Symbol("EMPTY");

type Empty = typeof EMPTY;

type BaseParticipantNames = string | Empty;

export class SequenceDiagram<
  DiagramParticipantNames extends BaseParticipantNames = Empty
> {
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
