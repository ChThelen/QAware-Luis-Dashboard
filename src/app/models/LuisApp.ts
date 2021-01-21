const exampleLuisJson = { "intents": [{ "name": "TAXI__BOOK" }, { "name": "TAXI__PRICE" }, { "name": "TAXI__TIME" }, { "name": "TAXI__CANCEL" }], "entities": [{ "name": "location", "roles": [], "children": [{ "name": "from", "children": [] }, { "name": "over", "children": [] }, { "name": "destination", "children": [] }] }, { "name": "count", "roles": [] }], "composites": [], "closedLists": [], "regex_entities": [], "regex_features": [], "utterances": [{ "text": "Buch mir ein Taxi von M\u00fcnchen nach Berlin", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 9, "endPos": 11 }, { "entity": "location", "startPos": 22, "endPos": 28, "children": [{ "entity": "from", "startPos": 22, "endPos": 28 }] }, { "entity": "location", "startPos": 35, "endPos": 40, "children": [{ "entity": "destination", "startPos": 35, "endPos": 40 }] }] }, { "text": "Ich brauche um 14 Uhr ein Taxi zuhause.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 22, "endPos": 24 }, { "entity": "location", "startPos": 31, "endPos": 37, "children": [{ "entity": "from", "startPos": 31, "endPos": 37 }] }] }, { "text": "Ruf mir ein Taxi.", "intent": "TAXI__BOOK", "entities": [] }, { "text": "Bestell mir ein Taxi f\u00fcr Freitag 16Uhr.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 12, "endPos": 14 }] }, { "text": "Bestell mir ein Taxi f\u00fcr den 20.11.2020 14 Uhr.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 12, "endPos": 14 }] }, { "text": "Hol mir ein Taxi nach Mainz.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 8, "endPos": 10 }, { "entity": "location", "startPos": 22, "endPos": 26, "children": [{ "entity": "destination", "startPos": 22, "endPos": 26 }] }] }, { "text": "Hol mir zwei Taxen um 22 Uhr.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 8, "endPos": 11 }] }, { "text": "Hol mir ein Taxi nach Essen und zur\u00fcck.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 8, "endPos": 10 }, { "entity": "location", "startPos": 22, "endPos": 26, "children": [{ "entity": "over", "startPos": 22, "endPos": 26 }] }, { "entity": "location", "startPos": 32, "endPos": 37, "children": [{ "entity": "destination", "startPos": 32, "endPos": 37 }] }] }, { "text": "Ruf mir ein Taxi zum Essen.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 8, "endPos": 10 }] }, { "text": "Ruf mir ein Taxi von Wiesbaden \u00fcber Frankfurt nach Dresden.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 8, "endPos": 10 }, { "entity": "location", "startPos": 21, "endPos": 29, "children": [{ "entity": "from", "startPos": 21, "endPos": 29 }] }, { "entity": "location", "startPos": 36, "endPos": 44, "children": [{ "entity": "over", "startPos": 36, "endPos": 44 }] }, { "entity": "location", "startPos": 51, "endPos": 57, "children": [{ "entity": "destination", "startPos": 51, "endPos": 57 }] }] }, { "text": "Bestell mir ein Taxi f\u00fcr morgen zu meinerFreundin.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 12, "endPos": 14 }, { "entity": "location", "startPos": 35, "endPos": 48, "children": [{ "entity": "from", "startPos": 35, "endPos": 48 }] }] }, { "text": "Taxi, 12Uhr", "intent": "TAXI__BOOK", "entities": [] }, { "text": "Was kostet ein Taxi von Mainz nach Bingen.", "intent": "TAXI__PRICE", "entities": [{ "entity": "count", "startPos": 11, "endPos": 13 }, { "entity": "location", "startPos": 24, "endPos": 28, "children": [{ "entity": "from", "startPos": 24, "endPos": 28 }] }, { "entity": "location", "startPos": 35, "endPos": 40, "children": [{ "entity": "destination", "startPos": 35, "endPos": 40 }] }] }, { "text": "Wann ist ein Taxi in Bingen.", "intent": "TAXI__TIME", "entities": [{ "entity": "count", "startPos": 9, "endPos": 11 }, { "entity": "location", "startPos": 21, "endPos": 26, "children": [{ "entity": "destination", "startPos": 21, "endPos": 26 }] }] }, { "text": "Wie lange dauert es mit dem Taxi von Ingelheim nach Wiesbaden.", "intent": "TAXI__TIME", "entities": [{ "entity": "location", "startPos": 37, "endPos": 45, "children": [{ "entity": "from", "startPos": 37, "endPos": 45 }] }, { "entity": "location", "startPos": 52, "endPos": 60, "children": [{ "entity": "destination", "startPos": 52, "endPos": 60 }] }] }, { "text": "Wann kann das n\u00e4chste Taxi bei mir sein.", "intent": "TAXI__TIME", "entities": [{ "entity": "location", "startPos": 27, "endPos": 33, "children": [{ "entity": "destination", "startPos": 27, "endPos": 33 }] }] }, { "text": "Ich brauche kein Taxi mehr.", "intent": "TAXI__CANCEL", "entities": [] }, { "text": "Storniere das Taxi am Freitag f\u00fcr 16Uhr.", "intent": "TAXI__CANCEL", "entities": [] }, { "text": "Bestell mein Taxi f\u00fcr den 20. November ab.", "intent": "TAXI__CANCEL", "entities": [] }, { "text": "Bestell mein Taxi ab.", "intent": "TAXI__CANCEL", "entities": [] }], "patterns": [], "patternAnyEntities": [], "prebuiltEntities": [{ "name": "datetimeV2", "roles": [] }], "luis_schema_version": "7.0.0", "versionId": "0.1", "name": "", "desc": "", "culture": "en-us", "phraselists": [] };

export enum LuisAppState {
  deployed = "deployed",
  published = "published",
  failed = "failed"
}

export class LuisApp {
  name: string;
  appID: string;
  version: string = '1.0';
  dashboardUrl?: string = 'https://eu.luis.ai';
  description?: string = "";
  status: LuisAppState = LuisAppState.failed;
  appJson?: any = "{}";
}

export const DUMMY_APPS: LuisApp[] = [
  {
    appID: "e646d8fd-201a-4688-b86a-f90ba098d91f",
    name: "App 1",
    version: "1.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.deployed,
    appJson: exampleLuisJson
  },
  {
    appID: "e646d8fd-201a-4688-b86a-f90ba098d91f",
    name: "App 2",
    version: "1.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.published,
    appJson: exampleLuisJson
  },
  {
    appID: "e646d8fd-201a-4688-b86a-f90ba098d91f",
    name: "App 3",
    version: "1.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.published,
    appJson: exampleLuisJson
  },
  {
    appID: "e646d8fd-201a-4688-b86a-f90ba098d91f",
    name: "App 4",
    version: "1.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.failed,
    appJson: exampleLuisJson
  },
];