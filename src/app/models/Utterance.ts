import { EntityLabel } from "./EntityLabel";

export class Utterance{
    text: string;
    intentName: string;
    entityLabels: EntityLabel[];
}
