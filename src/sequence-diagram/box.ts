import { DiagramEntity, DiagramEntityType } from "../diagram";

export const BoxType = 'box';

export class Box<ParticipantName extends string> implements DiagramEntity {
    public readonly type = DiagramEntityType.Box;

    constructor(public readonly boxName: string) {}
}