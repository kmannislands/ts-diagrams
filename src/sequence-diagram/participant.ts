import { IDiagramEntity } from "../diagram";
import { SeqDiagramEntityType } from "./sequence-diagram-entities";

export enum ParticipantType {
  Participant = "participant",
  Actor = "actor",
  Boundary = "boundary",
  Control = "control",
  Entity = "entity",
  Database = "database",
  Collections = "collections",
  Queue = "queue",
}

export class Participant<ParticipantName extends string>
  implements IDiagramEntity<SeqDiagramEntityType.Participant>
{
  public readonly type = SeqDiagramEntityType.Participant;

  constructor(
    public readonly name: ParticipantName,
    public readonly subType: ParticipantType = ParticipantType.Participant
  ) {}
}
