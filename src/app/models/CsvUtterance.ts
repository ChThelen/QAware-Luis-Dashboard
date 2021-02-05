export class CsvUtterance {
    id: string;
    transcript: string;
    category: string;
    literal: string;
    startIndex: string;
    endIndex: string;
    intent: string;
    tag:string;
    locked?:boolean; 
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
    "number",
    "transcript",
    "category",
    "literal",
    "start",
    "end",
    "intent",
    "tags"
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