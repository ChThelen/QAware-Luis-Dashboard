class IntentStats {
    intent: string;
    average: number;
    wrongIntents?: string[];
}

export class LuisAppStats {
    version: string;
    date: Date;
    containsWrongIntent: boolean;
    intents: IntentStats[];
}

export const DUMMY_STATS: LuisAppStats[] = [
    {
        version: "0.1",
        date: new Date("05.01.21"),
        containsWrongIntent: false,
        intents: [
            {
                intent: "TAXI_BOOK",
                average: 0.0
            },
            {
                intent: "TAXI_PRICE",
                average: 0.0
            },
            {
                intent: "TAXI_TIME",
                average: 0.0
            },
            {
                intent: "TAXI_CANCEL",
                average: 0.0
            }
        ]

    },
    {
        version: "0.2",
        date: new Date("05.01.21"),
        containsWrongIntent: true,
        intents: [
            {
                intent: "TAXI_BOOK",
                average: 0.8665849
            },
            {
                intent: "TAXI_PRICE",
                average: 0.8592530456666667
            },
            {
                intent: "TAXI_TIME",
                average: 0.8665849
            },
            {
                intent: "TAXI_CANCEL",
                average: 0.8592530456666667,
                wrongIntents: ["TAXI__BOOK", "TAXI__CANCEL", "TAXI__TIME"]
            }
        ]

    },
    {
        version: "0.3",
        date: new Date("06.01.21"),
        containsWrongIntent: false,
        intents: [
            {
                intent: "TAXI_BOOK",
                average: 0.0
            },
            {
                intent: "TAXI_PRICE",
                average: 0.8665849
            },
            {
                intent: "TAXI_TIME",
                average: 0.8592530456666667
            },
            {
                intent: "TAXI_CANCEL",
                average: 0.0
            }
        ]

    },
    {
        version: "0.4",
        date: new Date("07.01.21"),
        containsWrongIntent: true,
        intents: [
            {
                intent: "TAXI_BOOK",
                average: 0.8592530456666667
            },
            {
                intent: "TAXI_PRICE",
                average: 0.8592530456666667
            },
            {
                intent: "TAXI_TIME",
                average: 0.8665849,
                wrongIntents: ["TAXI__BOOK", "TAXI__CANCEL", "TAXI__TIME"]
            },
            {
                intent: "TAXI_CANCEL",
                average: 0.8665849,
                wrongIntents: ["TAXI__BOOK", "TAXI__CANCEL", "TAXI__TIME"]
            }
        ]

    }
]