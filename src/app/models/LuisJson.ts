class IntentJson{
    name: string;
    features: string[];
}
class EntityJson{
    name: string;
    children: EntityJson[];
    features: string[];
    roles: string[];
}
class Entity2Json{
    entity: string;
    startPos: number;
    endPos: number;
    children: Entity2Json[];
}
class UtteranceJson{
    text: string;
    intent: string;
    entities: Entity2Json[];
}
export class LuisJson{
    luis_schema_version: string;
    intents: IntentJson[];
    entities: EntityJson[];
    prebuiltEntities: EntityJson[];
    utterances: UtteranceJson[];
    versionId: string;
    name: string;
    desc: string;
    culture: string;
    closedLists: string[];
    phraselists: string[];
    regex_features: string[];
    patterns: string[];
    settings: string[];
    tokenizerVersion: string[];
    patternAnyEntities: string[];
    regex_entities: string[];
    composites: string[];
    hierarchicals: string[];
}