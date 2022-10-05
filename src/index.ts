interface SequenceMessage<ParticipantName extends BaseParticipantNames> {
  from: ParticipantName;
  to: ParticipantName;
  label: string;

  dotted?: boolean;
}

interface Participant {}

interface Actor extends Participant {
  type: "actor";
}

const EMPTY = Symbol('EMPTY');

type Empty = typeof EMPTY;

type BaseParticipantNames = string | Empty;

class SequenceDiagram<DiagramParticipantNames extends BaseParticipantNames = Empty> {
  constructor(_participants?: DiagramParticipantNames) {}

  public addActor<ActorName extends string>(
    _actorName: ActorName
  ): SequenceDiagram<DiagramParticipantNames | ActorName> {
    return this;
  }

  public addMessage(_msg: SequenceMessage<DiagramParticipantNames>): SequenceDiagram<DiagramParticipantNames> {
    return new SequenceDiagram();
  }
}

// Example syntax:
new SequenceDiagram()
  .addActor("Alice")
  .addActor("Bob")
  .addMessage({ from: "Alice", to: "Bob", label: "Authentication Request" })
  .addMessage({
    from: "Bob",
    to: "Alice",
    label: "Authentication Response",
    dotted: true,
  });
