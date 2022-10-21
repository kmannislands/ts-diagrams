import { describe, expect, it } from '@jest/globals';
import { renderDiagramToPlantUML } from './frontend-plantuml';
import { SequenceDiagram } from './sequence-diagram';
import { Participant, ParticipantType } from './sequence-diagram/participant';

/**
 * Based off a subset of PUML features from sequence diagram example.
 *
 * @see https://plantuml.com/sequence-diagram
 */
describe('Sequence Diagram integration with PlantUML frontend', () => {
    it('matches expectated rendered source code for the simplest example', () => {
        const classicExample = new SequenceDiagram()
            .addActor('Alice')
            .addActor('Bob')
            .addMessage({
                from: 'Alice',
                to: 'Bob',
                label: 'Authentication Request',
            })
            .addMessage({
                from: 'Bob',
                to: 'Alice',
                label: 'Authentication Response',
                dotted: true,
            });

        const renderedSource = renderDiagramToPlantUML(classicExample);

        expect(renderedSource).toMatchInlineSnapshot(`
"@startuml 
actor "Alice"
actor "Bob"

Alice -> Bob : Authentication Request
Bob --> Alice : Authentication Response

@enduml"
`);
    });

    it('Supports all participant types', () => {
        const allParticipants = new SequenceDiagram()
            .addParticipant('Participant', 'participant')
            .addParticipant('Actor', 'actor')
            .addParticipant('Boundary', 'boundary')
            .addParticipant('Control', 'control')
            .addParticipant('Entity', 'entity')
            .addParticipant('Database', 'database')
            .addParticipant('Collections', 'collections')
            .addParticipant('Queue', 'queue')
            .addMessage({
                from: 'Participant',
                to: 'Actor',
                label: 'To actor ',
            })
            .addMessage({
                from: 'Participant',
                to: 'Boundary',
                label: 'To boundary',
            })
            .addMessage({
                from: 'Participant',
                to: 'Control',
                label: 'To control',
            })
            .addMessage({
                from: 'Participant',
                to: 'Entity',
                label: 'To entity',
            })
            .addMessage({
                from: 'Participant',
                to: 'Database',
                label: 'To database',
            })
            .addMessage({
                from: 'Participant',
                to: 'Collections',
                label: 'To collections',
            })
            .addMessage({
                from: 'Participant',
                to: 'Queue',
                label: 'To queue',
            });

        const renderedSource = renderDiagramToPlantUML(allParticipants);

        expect(renderedSource).toMatchInlineSnapshot(`
"@startuml 
participant "Participant"
actor "Actor"
boundary "Boundary"
control "Control"
entity "Entity"
database "Database"
collections "Collections"
queue "Queue"

Participant -> Actor : To actor 
Participant -> Boundary : To boundary
Participant -> Control : To control
Participant -> Entity : To entity
Participant -> Database : To database
Participant -> Collections : To collections
Participant -> Queue : To queue

@enduml"
`);
    });

    it('works with design for alias', () => {
        const longNameParticipant = new Participant(
            'I have a very long name',
            ParticipantType.Database
        );

        const longNameExample = new SequenceDiagram()
            .addParticipantInstance(longNameParticipant)
            .addMessage({
                from: longNameParticipant,
                to: longNameParticipant,
                label: 'Self-call',
            });

        expect(renderDiagramToPlantUML(longNameExample)).toMatchInlineSnapshot(`
"@startuml 
database "I have a very long name" as database1

database1 -> database1 : Self-call

@enduml"
`);
    });

    it('works with box', () => {
        const diag = new SequenceDiagram()
            .box('VPN', (d) =>
                d
                    .addActor('Internal user')
                    .addParticipant('Internal DB', ParticipantType.Database)
            )
            .addMessage({
                from: 'Internal user',
                to: 'Internal DB',
                label: 'Insert rows',
            });

        expect(renderDiagramToPlantUML(diag)).toMatchInlineSnapshot(`
"@startuml 
box vpn
  actor "Internal user" as actor1
  database "Internal DB" as database1
end box

Internal user -> Internal DB : Insert rows

@enduml"
`);
    });
});
