export class Utterance {
    id: string;
    transcript: string;
    category: string;
    literal: string;
    startIndex: string;
    endIndex: string;
    intent: string;
    constructor()
    {
      this.id           = "";
      this.category     = "";
      this.literal      = "";
      this.transcript   = "";
      this.endIndex     = "";
      this.startIndex   = "";
      this.intent       = "";
    }
}

export const HEADERS: string[] = [
    "#",
    "transcript",
    "category",
    "literal",
    "start_index",
    "end_index",
    "intent"
];