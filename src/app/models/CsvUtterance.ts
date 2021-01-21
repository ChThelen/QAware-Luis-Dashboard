export class CsvUtterance {
    id: string;
    transcript: string;
    category: string;
    literal: string;
    startIndex: string;
    endIndex: string;
    intent: string;
    tag:string;
    constructor()
    {
      this.id           = "";
      this.category     = "";
      this.literal      = "";
      this.transcript   = "";
      this.endIndex     = "";
      this.startIndex   = "";
      this.intent       = "";
      this.tag          = "";
    }
}

export const HEADERS: string[] = [
    "#",
    "transcript",
    "category",
    "literal",
    "start_index",
    "end_index",
    "intent",
    "tag"
];

export const BADGES: string[] =
[
  "badge-1",
  "badge-2",
  "badge-3",
  "badge-4",
  "badge-5",
  "badge-succes",
  "badge-danger",
];