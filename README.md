<span align="center">
  
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Apache License][license-shield]][license-url]

</span>

<p align="center">

  <h3 align="center">QAware Luis-Dashboard</h3>

  <p align="center">
    This dashboard is used to interact with a separate backend service. With the help of the dashboard, various steps from creating to deploying a Microsoft LuisApp can be applied or automated.
    <br />
    <a href="https://github.com/latzinger/QAware-Luis-Dashboard/issues">Report Bug</a>
    ·
    <a href="https://github.com/latzinger/QAware-Luis-Dashboard/issues">Request Feature</a>
  </p>
</p>

## Table of contents

* [About the Project](#about-the-project)
  * [What is Microsoft Luis?](#what-is-microsoft-luis?)
  * [Built With](#built-with)
* [Development Setup](#development-setup)
* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)
* [Build](#build)
* [Services](#services)
* [Components](#components)
  * [Dashboard](#dashboard)
  * [App Deployment](#app-deployment)
  * [App Management](#app-management)
  * [App Statistics](#app-statistics)
  * [GroundTruth Editor](#groundtruth-editor)
* [Contributing](#contributing)
* [License](#license)

## About The Project

### What is Microsoft Luis?

Language Understanding (LUIS) is a cloud-based conversational AI service that applies custom machine-learning intelligence to a user's conversational, natural language text to predict overall meaning, and pull out relevant, detailed information.

More Information can be found under [Microsoft-Luis][luis].

### Built With
* [Angular](https://angular.io)
* [Clarity](https://clarity.design/)

## Development Setup

### Prerequisites
* [QAware-Luis-Backend](https://github.com/latzinger/QAware-Luis)
* Install [Node.js] which includes [Node Package Manager][npm]

Install the Angular CLI globally:

```
npm install -g @angular/cli
```

### Getting Started

Serve Angular App:

```
ng serve --open
```

### Build
* Install [Apache Maven][mvn]

```
mvn clean install
```

## Services
- **LuisAppService:** Responsible for handling operations related to the luis-api by requesting the backend.
- **PersistentService:** Responsible for retrieving presistent app information like AppData, AppStats and the GroundTruth from the backend.
- **ConvertService:** Responsible for converting CSV-Files to LuisJson-Files and vica versa, by requesting the backend.
- **NotificationService:** Responsible for handling standard and app-level alerts.

## Components

### Dashboard
| Functionality  | Supported |
| :---         |     :---:      |
| Dark Mode  | ✅  |
| Card & List-View  | ✅  |

<img align="left" src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/Dashboard-Light.png"/> 
<!---<img src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/Dashboard-Dark.png" width="425"/>-->

<img align="left" src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/Dashboard-Light-List.png"/> 
<!---<img src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/Dashboard-Dark-List.png" width="425"/>-->

### App Deployment

### App Management
| Functionality  | Supported |
| :---         |     :---:      |
| View Name, Id, Status and Description  | ✅  |
| Integrated Microsoft Luis Dashboard Link  | ✅  |
| Publish deployed App  | ✅  |
| Train published App  | ✅  |
| Test published App  | ✅  |
| Edit App (add Intents, Utterances or Entities)   | ✅  |
| Update published App to new version | ✅  |
| View & Download LuisJSON | ✅  |
| Delete App  | ✅  |

<img align="left" src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/App-Light.png"/>
<!---<img src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/App-Dark.png" width="425"/>-->

<img align="left" src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/App-Light-Edit.png"/>
<!---<img src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/App-Dark-Edit.png" width="425"/>-->

<img align="left" src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/App-Light-Json.png"/>
<!---<img src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/App-Dark-Json.png" width="425"/>-->

### App Statistics
| Functionality  | Supported |
| :---         |     :---:      |
| View Test History  | ✅  |
| View Charts  | ✅  |

<img align="left" src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/App-Light-Statistics.png"/>
<!---<img src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/App-Dark-Statistics.png" width="425"/>-->

<img align="left" src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/App-Light-Statistics-Table.png"/> 
<!---<img src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/App-Dark-Statistics-Table.png" width="425"/>-->

### GroundTruth Editor
| Functionality  | Supported |
| :---         |     :---:      |
| View GroundTruth  | ✅  |
| Edit GroundTruth  | ✅  |
| Extend GroundTruth via uploaded CSV-File  | ✅  |
| Create new LuisApp by selecting custom GroundTruth Entries | ✅  |

<img align="left" src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/GroundTruthEditor-Light.png"/> 
<!---<img src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/GroundTruthEditor-Dark.png" width="425"/>-->

<img align="left" src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/GroundTruthEditor-Light-Merge.png"/> 
<!---<img src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/GroundTruthEditor-Dark-Merge.png" width="425"/>-->

<img align="left" src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/GroundTruthEditor-Light-NewLine.png"/> 
<!---<img src="https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/images/GroundTruthEditor-Dark-NewLine.png" width="425"/>-->

## Contributing

1. Fork or clone the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the Apache License. See `LICENSE` for more information.

[contributors-shield]: https://img.shields.io/github/contributors/latzinger/QAware-Luis-Dashboard
[contributors-url]: https://github.com/latzinger/QAware-Luis-Dashboard/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/latzinger/QAware-Luis-Dashboard
[forks-url]: https://github.com/latzinger/QAware-Luis-Dashboard/network/members
[stars-shield]: https://img.shields.io/github/stars/latzinger/QAware-Luis-Dashboard
[stars-url]: https://github.com/latzinger/QAware-Luis-Dashboard/stargazers
[issues-shield]: https://img.shields.io/github/issues/latzinger/QAware-Luis-Dashboard
[issues-url]: https://github.com/latzinger/QAware-Luis-Dashboard/issues
[license-shield]: https://img.shields.io/github/license/latzinger/QAware-Luis-Dashboard
[license-url]: https://github.com/latzinger/QAware-Luis-Dashboard/blob/main/LICENSE
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/get-npm
[mvn]: https://maven.apache.org/index.html
[luis]: https://www.luis.ai
