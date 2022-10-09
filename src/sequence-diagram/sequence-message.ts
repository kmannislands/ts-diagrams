import { DiagramEntity, DiagramEntityType } from "../diagram";

export interface SequenceMessageConfig<ParticipantName extends string> {
  from: ParticipantName;
  to: ParticipantName;
  label?: string;

  // TODO separate style
  dotted?: boolean;
}

export class SequenceMessage<ParticipantName extends string> implements SequenceMessageConfig<ParticipantName>, DiagramEntity {
  public readonly type = DiagramEntityType.Message;

  constructor(private readonly message: SequenceMessageConfig<ParticipantName>) {}

  get from(): ParticipantName {
    return this.message.from;
  }

  get to(): ParticipantName {
    return this.message.to;
  }

  get label(): string {
    return this.message.label || '';
  }

  get dotted(): boolean {
    return Boolean(this.message.dotted);
  }
}
