import { SequenceDiagram } from "./sequence-diagram";

// Add to union with new types:
export type Diagram = SequenceDiagram;

export enum DiagramEntityType {
  Participant = "participant",
  Message = "message",
}

export interface DiagramEntity {
  type: DiagramEntityType;
  name: string;
  meta?: any;
}

export type DiagramEntityPointer = number;

export type DiagramEntityIndex = Record<
  DiagramEntityType,
  Record<string, DiagramEntityPointer>
>;
