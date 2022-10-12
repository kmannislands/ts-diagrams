import { IDiagramEntity } from "../diagram";
// import { EntityContainer } from "../entity-container";
import { IParticipantContainer } from "./IParticipantContainer";
import { SeqDiagramEntityType } from "./sequence-diagram-entities";

export const BoxType = "box";

export class Box<ParticipantName extends string>
  implements
    IDiagramEntity<SeqDiagramEntityType.Box>,
    IParticipantContainer<ParticipantName>
{
  public readonly type = SeqDiagramEntityType.Box;

  // private container = new EntityContainer();

  constructor(public readonly boxName: string) {}

  // public entities = this.container.entities;
}
