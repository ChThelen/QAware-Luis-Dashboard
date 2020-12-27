export class Utterance {
    id: string;
    transcript: string;
    category: string;
    literal: string;
    startIndex: string;
    endIndex: string;
    intent: string;
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