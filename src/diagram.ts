import { SequenceDiagram } from "./sequence-diagram";

// Add to union with new types:
export type Diagram = SequenceDiagram<string>;

export enum DiagramEntityType {
  Participant = "participant",
  Message = "message",
  Box = "box",
}

export interface DiagramEntity {
  type: DiagramEntityType,
}

export type DiagramEntityPointer = number;

export type DiagramEntityIndex = Record<
  DiagramEntityType,
  Record<string, DiagramEntityPointer>
>;
