import { describe, it, expect } from '@jest/globals';
import { IDiagramEntity } from './diagram';
import { EntityContainer } from './entity-container';

enum TestEntityTypes {
    Foo = 'foo',
    Bar = 'bar',
    Baz = 'baz',
}

class FooEntity implements IDiagramEntity<TestEntityTypes.Foo> {
    type: TestEntityTypes.Foo = TestEntityTypes.Foo;
}

class BarEntity implements IDiagramEntity<TestEntityTypes.Bar> {
    type: TestEntityTypes.Bar = TestEntityTypes.Bar;
}

class BazEntity implements IDiagramEntity<TestEntityTypes.Baz> {
    type: TestEntityTypes.Baz = TestEntityTypes.Baz;
}

type TestEntity = FooEntity | BarEntity | BazEntity;

type TestEntityTypeMap = {
    [k in TestEntityTypes]: k extends TestEntityTypes.Foo
        ? FooEntity
        : k extends TestEntityTypes.Bar
        ? BarEntity
        : k extends TestEntityTypes.Baz
        ? BazEntity
        : never;
};

type TestEntityContainer = EntityContainer<
    TestEntityTypes,
    TestEntity,
    TestEntityTypeMap
>;

const entityContainer: TestEntityContainer = new EntityContainer([]);

describe('Sequence Diagram', () => {
    it('starts empty', () => {
        expect([...entityContainer.entities()]).toEqual([]);
    });

    it('is not mutated by withEntity calls', () => {
        expect([...entityContainer.entities()]).toEqual([]);

        // This should create a new container, leaving the original alone:
        const fooEnt = new FooEntity();
        const withFoo = entityContainer.withEntity(fooEnt);

        expect([...withFoo.entities()]).toEqual([fooEnt]);

        expect([...entityContainer.entities()]).toEqual([]);
    });

    describe('iteration narrowing', () => {
        it('narrows iterated entity types by a single argument', () => {
            const barEntity = new BarEntity();
            const kitchenSinkContainer = entityContainer
                .withEntity(new FooEntity())
                .withEntity(barEntity)
                .withEntity(new BazEntity());

            expect([
                ...kitchenSinkContainer.entities(TestEntityTypes.Bar),
            ]).toEqual([barEntity]);
        });

        it('narrows iterated entity types by a union', () => {
            const barEntity = new BarEntity();
            const bazEntity = new BazEntity();

            const kitchenSinkContainer = entityContainer
                .withEntity(new FooEntity())
                .withEntity(barEntity)
                .withEntity(bazEntity);

            expect([
                ...kitchenSinkContainer.entities(
                    TestEntityTypes.Bar,
                    TestEntityTypes.Baz
                ),
            ]).toEqual([barEntity, bazEntity]);
        });
    });
});
