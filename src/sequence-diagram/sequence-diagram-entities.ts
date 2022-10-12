import { Empty } from "../diagram";
import { Box } from "./box";
import { Participant } from "./participant";
import { SequenceMessage } from "./sequence-message";

export type BaseParticipantNames = string | Empty;

export enum SeqDiagramEntityType {
  Participant = "participant",
  Message = "message",
  Box = "box",
}

export type SequenceDiagramEntity<ParticipantName extends string> =
  | SequenceMessage<ParticipantName>
  | Participant<ParticipantName>
  | Box<ParticipantName>;

export type SequenceDiagramEntityMap = {
  [k in SeqDiagramEntityType]: k extends SeqDiagramEntityType.Participant
    ? Participant<string>
    : k extends SeqDiagramEntityType.Message
    ? SequenceMessage<string>
    : k extends SeqDiagramEntityType.Box
    ? Box<string>
    : never;
};

export type DefinedParticipantNames<
  ExistingNames extends BaseParticipantNames
> = Exclude<ExistingNames, Empty>;
