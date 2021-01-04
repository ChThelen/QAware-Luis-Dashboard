export class CsvUtterance {
    id: string;
    transcript: string;
    category: string;
    literal: string;
    startIndex: string;
    endIndex: string;
    intent: string;

    constructor(){
        this.id = "";
        this.transcript = "";
        this.category = "";
        this.literal = "";
        this.startIndex = "";
        this.endIndex = "";
        this.intent = "";
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