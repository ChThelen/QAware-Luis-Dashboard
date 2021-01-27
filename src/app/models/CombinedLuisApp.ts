import {LuisApp, DUMMY_APPS, EXAMPLE_JSON} from './LuisApp';
import {LuisAppStats, DUMMY_STATS} from './LuisAppStats';

export class CombinedLuisApp{
    appData: LuisApp;
    statData: LuisAppStats[];
    json: any;
}

export const EXAMPLE_COMBINED_LUIS_APP: CombinedLuisApp = {
    appData: DUMMY_APPS[0],
    statData: DUMMY_STATS,
    json: EXAMPLE_JSON
}