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
    appID: "e646d8fd-201a-4688-b86a-f90ba098d91f",
    name: "App 1",
    version: "1.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.deployed
  },
  {
    appID: "e646d8fd-201a-4688-b86a-f90ba098d91f",
    name: "App 2",
    version: "1.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.published
  },
  {
    appID: "e646d8fd-201a-4688-b86a-f90ba098d91f",
    name: "App 3",
    version: "1.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.published
  },
  {
    appID: "e646d8fd-201a-4688-b86a-f90ba098d91f",
    name: "App 4",
    version: "1.0",
    dashboardUrl: "https://eu.luis.ai",
    description: "This is an Example App for Luis.",
    status: LuisAppState.failed
  },
];