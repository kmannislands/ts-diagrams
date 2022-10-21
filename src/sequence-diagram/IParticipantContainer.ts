import { Empty } from '../diagram';
import { Participant, ParticipantType } from './participant';
import { BaseParticipantNames } from './sequence-diagram-entities';

/**
 * Interface for something that can contain participant declarations like a SequenceDiagram or a Box within a
 * sequence diagram.
 */
export interface IParticipantContainer<
    ParticipantNames extends BaseParticipantNames = string
> {
    /**
     * @todo make this an overload of `addParticipant`?
     */
    addParticipantInstance<ParticipantName extends string>(
        participant: Participant<ParticipantName>
    ): IParticipantContainer<ParticipantNames | ParticipantName>;

    /**
     *
     */
    addParticipant<NewParticipantName extends string>(
        participantName: NewParticipantName,
        type?: ParticipantType | `${ParticipantType}`
    ): IParticipantContainer<
        Exclude<ParticipantNames | NewParticipantName, Empty>
    >;

    /**
     * Convenience wrapper over addParticipant
     */
    addActor<ActorName extends string>(
        actorName: ActorName
    ): IParticipantContainer<ParticipantNames | ActorName>;
}
