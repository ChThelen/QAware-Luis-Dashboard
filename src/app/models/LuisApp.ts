export enum LuisAppState {
  deployed = "DEPLOYED",
  published = "PUBLISHED",
  failed = "FAILED"
}

export class LuisApp {
  appName: string;
  appId: string;
  version: string = '1.0';
  dashboardUrl?: string = 'https://eu.luis.ai';
  description?: string;
  status: LuisAppState;
}

export const DUMMY_APPS: LuisApp[] = [
  {
    appId: "8d90ß256lknsa620213",
    appName: "App 1",
    version: "1.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.deployed
  },
  {
    appId: "addsa234sdfkzlj54kl6",
    appName: "App 2",
    version: "2.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.published
  },
  {
    appId: "8237jhlsdf0ß0302bhj",
    appName: "App 3",
    version: "3.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.published
  },
  {
    appId: "8237jhlsdasdjh22bhj",
    appName: "App 4",
    version: "1.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.failed
  },
];