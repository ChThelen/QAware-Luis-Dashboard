class IntentStats {
    intent: string;
    average: number;
    falseIntents?: any;
    falseIntentsMessage?: string;
}

export class LuisAppStats {
    version: string;
    date: Date;
    intents: IntentStats[];
    containsBadIntent?: boolean = false;
}

export const DUMMY_STATS: LuisAppStats[] = [
    {
        version: "0.1",
        date: new Date("05.01.21"),
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
                falseIntents: { "Key2": "Value2", "Key1": "Value1", "Key3": "Value3" }
            }
        ]

    },
    {
        version: "0.3",
        date: new Date("06.01.21"),
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
                falseIntents: { "Key2": "Value2", "Key1": "Value1", "Key3": "Value3" }
            },
            {
                intent: "TAXI_CANCEL",
                average: 0.8665849,
                falseIntents: { "Key2": "Value2", "Key1": "Value1", "Key3": "Value3" }
            }
        ]

    }
]