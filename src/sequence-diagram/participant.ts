import { DiagramEntity, DiagramEntityType } from "../diagram";

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

export class Participant<ParticipantName extends string> implements DiagramEntity {
  public readonly type = DiagramEntityType.Participant;

  constructor(
    public readonly name: ParticipantName,
    public readonly subType: ParticipantType = ParticipantType.Participant
  ) {}
}
