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
  description?: string;
  status: LuisAppState;
}

export const DUMMY_APPS: LuisApp[] = [
  {
    appID: "8d90ß256lknsa620213",
    name: "App 1",
    version: "1.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.deployed
  },
  {
    appID: "addsa234sdfkzlj54kl6",
    name: "App 2",
    version: "2.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.published
  },
  {
    appID: "8237jhlsdf0ß0302bhj",
    name: "App 3",
    version: "3.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.published
  },
  {
    appID: "8237jhlsdasdjh22bhj",
    name: "App 4",
    version: "1.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.failed
  },
];