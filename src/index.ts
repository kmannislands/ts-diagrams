interface SequenceMessage {
    from: string,
    to: string,
    label: string,

    dotted?: boolean,
}

class SequenceDiagram {
  public addActor(_actorName: string): SequenceDiagram {
    return this;
  }

  public addMessage(_msg: SequenceMessage): SequenceDiagram {
    return this;
  }
}


// Example syntax:
new SequenceDiagram()
  .addActor("Alice")
  .addActor("Bob")
  .addMessage({ from: "Alice", to: "Bob", label: 'Authentication Request' })
  .addMessage({ from: "Bob", to: "Alice", label: 'Authentication Response', dotted: true });
