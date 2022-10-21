import type { SequenceDiagram } from "./sequence-diagram";

// Special empty token that *should not be exported from the library* used to satisfy initial conditions for
// str lit union types
export const EMPTY = Symbol("EMPTY");
export type Empty = typeof EMPTY;

// Add new diagram types to the union as they're created:
export type Diagram = SequenceDiagram<string>;

export interface IDiagramEntity<EntityType extends string> {
  type: EntityType;
}

export enum DiagramType {
  SequenceDiagram = "sequence",
}

export interface IDiagram<Type extends DiagramType> {
  diagramType: Type;
}
