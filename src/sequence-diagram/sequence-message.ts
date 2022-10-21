import { IDiagramEntity } from '../diagram';
import { Participant } from './participant';
import { SeqDiagramEntityType } from './sequence-diagram-entities';

export interface SequenceMessageConfig<ParticipantName extends string> {
    from: ParticipantName | Participant<ParticipantName>;
    to: ParticipantName | Participant<ParticipantName>;
    label?: string;

    // TODO separate style
    dotted?: boolean;
}

export class SequenceMessage<ParticipantName extends string>
    implements
        SequenceMessageConfig<ParticipantName>,
        IDiagramEntity<SeqDiagramEntityType.Message>
{
    __name!: ParticipantName;

    public readonly type = SeqDiagramEntityType.Message;

    constructor(
        private readonly message: SequenceMessageConfig<ParticipantName>
    ) {}

    get from(): ParticipantName | Participant<ParticipantName> {
        return this.message.from;
    }

    get to(): ParticipantName | Participant<ParticipantName> {
        return this.message.to;
    }

    get label(): string {
        return this.message.label || '';
    }

    get dotted(): boolean {
        return Boolean(this.message.dotted);
    }
}
