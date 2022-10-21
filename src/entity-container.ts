import { IDiagramEntity } from './diagram';

type DiagramEntityType = string;

type BaseEntityTypeMap<
    EntityTypeName extends DiagramEntityType,
    EntityType extends IDiagramEntity<EntityTypeName>
> = {
    [entityType in EntityTypeName]: EntityType | never;
};

interface IEntityContainer<
    EntityType extends string,
    Entity extends IDiagramEntity<EntityType>
> {
    /**
     * Iterate over entities that this participant container contains
     */

    entities(...entityTypes: DiagramEntityType[]): Generator<Entity>;
}

/**
 * Generic container to hold 'entities' that comprise different diagrams. Intended to be composed with
 * concrete Diagram classes
 */
export class EntityContainer<
    EntityType extends string,
    DiagramEntity extends IDiagramEntity<EntityType>,
    EntityTypeMap extends BaseEntityTypeMap<EntityType, DiagramEntity>
> implements IEntityContainer<EntityType, DiagramEntity>
{
    constructor(private diagramEntities: DiagramEntity[]) {}

    public withEntity(
        newEntity: IDiagramEntity<EntityType>
    ): EntityContainer<EntityType, DiagramEntity, EntityTypeMap> {
        // TODO figure out index typing
        return new EntityContainer([...this.entities(), newEntity] as any);
    }

    entities<EntityTypes extends EntityType[]>(
        ...entityTypes: EntityTypes
    ): Generator<EntityTypeMap[EntityTypes[number]]>;
    public *entities(...entityTypes: EntityType[]) {
        const narrowEntities = entityTypes.length > 0;
        // TODO could iterate over a smaller list with a cached index. Heuristic based on expected usage pattern:
        // if one entity type is read on an instance, others are likely to. However, most instances are
        // unlikely to be read (since they're transient instances used in chaining).
        for (const entity of this.diagramEntities) {
            const isRequestedEntity = entityTypes.includes(entity.type);
            if (narrowEntities && !isRequestedEntity) {
                continue;
            }
            yield entity;
        }
    }
}
