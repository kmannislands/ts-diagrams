import { DiagramEntityType } from "../diagram";
import { Participant } from "./participant";
import { SequenceMessage } from "./sequence-message";

export type SequenceDiagramEntity<ParticipantName extends string> =
  | SequenceMessage<ParticipantName>
  | Participant<ParticipantName>;

export type SequenceDiagramEntityMap = {
  [k in DiagramEntityType]: k extends DiagramEntityType.Participant
    ? Participant<string>
    : k extends DiagramEntityType.Message
    ? SequenceMessage<string>
    : never;
};
