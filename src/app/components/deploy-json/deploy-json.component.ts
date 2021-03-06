import { Component, OnInit } from '@angular/core';
import { HEADERS, CsvUtterance } from 'src/app/models/CsvUtterance';
import { ConvertService } from 'src/app/services/convert.service';
import { LuisAppService } from 'src/app/services/luis-app.service';
import { PersistentService } from 'src/app/services/persistent.service';
import { NotificationType, Notification, NotificationService } from 'src/app/services/notification.service';
import { LuisApp } from 'src/app/models/LuisApp';
import { Validators, FormGroup, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-deploy-json',
  templateUrl: './deploy-json.component.html',
  styleUrls: ['./deploy-json.component.scss']
})
export class DeployJsonComponent implements OnInit {

  form: FormGroup;
  appToUpdate: LuisApp = null;
  existingAppNames: string[];
  trained = false;
  colors = ["label label-info","label label-success","label label-warning","label label-danger"];
 // GT properties
  result: CsvUtterance[] = [];
  groundTruth: string = "";
  intents: string[] = [];
// Selected data 
  selectedTestdata: CsvUtterance[] = [];
  selectedTrainingsdata: CsvUtterance[] = [];
// Selected Buttons properties
  intentsSelectionTestdata: boolean[] = [];
  intentsSelectionTraindata: boolean[] = [];

  openModalUpdateSettings = false;
  
  json: string = "";
// Layout direction changing
  layout = {
    direction: "vertical",
    block1: "clr-col-lg-3 clr-col-12 ",
    block2: "clr-col-lg-9 clr-col-12 ",
  }
// CSV File for Test data
  uploadedFile = {
    exist: false,
    content: '',
    name: ''
  }

  data = {
    type: 'train',
    uploadedFile: false
  };
  //Timeline 
  timelineStyle = {
    step0: { state: "current", open: true, failed: false },
    step1: { state: "not-started", open: false, failed: false },
    step2: { state: "not-started", open: false, failed: false },
    step3: { state: "not-started", open: false, failed: false },
    step4: { state: "not-started", open: false, failed: false },
  };
//App Properties 
  luisApp =
    {
      name: '',
      description: '',
      culture: 'de-de',
      id: '',
      url: '',
      version: '1.0',
      created: 1,
      region: '',
      publishedDateTime: '',
      trained: 1,
      tested: 1,
      updated:1,
      published: 1,
      settings: { sentimentAnalysis: false, speech: false, spellChecker: false },
      isStaging: false,
    };

  constructor(
    private luisService: LuisAppService,
    private persistentService: PersistentService,
    private convertService: ConvertService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {

    this.appToUpdate = history.state;

    this.persistentService.getGT().subscribe(data => {
      this.groundTruth = data;
      this.createUtterances();
      this.intents = this.getTestIntents();
      this.intents = this.getTrainIntents();

      if ((this.appToUpdate as LuisApp).appID) {
        this.getAppInfos();
        this.findTrainingsDataUtterances();
        this.findTestDataUtterances();
        
      }
      else {
        this.appToUpdate = null;
      }

      this.luisService.getAppNames().subscribe(appNames => {
        this.existingAppNames = appNames;
        this.form = new FormGroup({
          appName: new FormControl({ value: '', disabled: this.luisApp.created == 0 }, [Validators.required, Validators.minLength(4), appNameValidator(this.existingAppNames)]),
          appDesc: new FormControl({ value: '', disabled: this.luisApp.created == 0 }),
          culture: new FormControl({ value: 'one', disabled: this.luisApp.created == 0 })
        });
      });
    } );

  }
  getAppInfos() {
    this.luisApp =
    {
      name: this.appToUpdate.name,
      description: this.appToUpdate.description,
      culture: 'de-de',
      id: this.appToUpdate.appID,
      url: '',
      version: String((parseFloat(this.appToUpdate.version) + 1).toFixed(1)),
      created: 1,
      updated:1,
      region: '',
      publishedDateTime: '',
      trained: 1,
      tested: 1,
      published: 1,
      settings: { sentimentAnalysis: false, speech: false, spellChecker: false },
      isStaging: false,
    };

  }
/**
 * upload selected training data Utterances 
 */
  findTrainingsDataUtterances() {
    // Convert to CSV

    this.convertService.convertJsonToCSV(this.appToUpdate.appJson)
      .subscribe(data => {
        // Convert to Utterances 
        let dataArray: string[] = data.split(/\r\n|\n/);
        console.log(dataArray)
        let i = 1;
        for (i = 1; i < dataArray.length; i++) {
          let currentLine = dataArray[i].split(";");

          // Compare Utterances
          let foundedUtterance = this.result.find(element =>
            element.transcript == currentLine[1] &&
            element.endIndex == currentLine[5] &&
            element.startIndex == currentLine[4] &&
            element.intent == currentLine[6] &&
            element.category == currentLine[2] &&
            element.literal == currentLine[3]
          );
          
          // Select Utterances                                  
          if (foundedUtterance) {
            
            foundedUtterance.locked = false;
            this.selectedTrainingsdata.push(foundedUtterance);
          }

        }

      });
  }
/**
 * upload selected training data Utterances 
 */
  findTestDataUtterances() {

    this.persistentService.getTestDataCSV(this.luisApp.name)
      .subscribe(data => {
        // Convert to Utterances 
        let dataArray: string[] = data.split(/\r\n|\n/);

        let i = 1;
        for (i = 1; i < dataArray.length; i++) {
          let currentLine = dataArray[i].split(";");

          // Compare Utterances
          let foundedUtterance = this.result.find(element =>
            element.transcript == currentLine[1] &&
            element.endIndex == currentLine[5] &&
            element.startIndex == currentLine[4] &&
            element.intent == currentLine[6] &&
            element.category == currentLine[2] &&
            element.literal == currentLine[3]
          );

          // Select Utterances                                  
          if (foundedUtterance) {
            foundedUtterance.locked = true;
            this.selectedTestdata.push(foundedUtterance);
          }

        }
      })
     
  }
  // Change to Horizontal Layout
  changeToHorizonTal() {
    this.layout = {
      direction: "horizontal",
      block1: "clr-col-lg-12 clr-col-12 height container",
      block2: "clr-col-lg-12 clr-col-12 container",
    }
  }
// Change to Vertical Layout
  changeToVertical() {
    this.layout = {
      direction: "vertical",
      block1: "clr-col-lg-3 clr-col-12 ",
      block2: "clr-col-lg-9 clr-col-12 ",
    }
  }
/**
 * Create Table Line
 * All Utterances are in @var result
 */
  createUtterances(): void {

    let dataArray: string[] = this.groundTruth.split(/\r\n|\n/);
    let headers = dataArray[0].split(";");

    let i = 1;
    for (i = 1; i < dataArray.length; i++) {
      let currentLine = dataArray[i].split(";");
      if (currentLine.length == headers.length) {
        let csvUtterance: CsvUtterance = new CsvUtterance();
        csvUtterance.id = currentLine[0];
        csvUtterance.transcript = currentLine[1];
        csvUtterance.category = currentLine[2];
        csvUtterance.literal = currentLine[3];
        csvUtterance.startIndex = currentLine[4];
        csvUtterance.endIndex = currentLine[5];
        csvUtterance.intent = currentLine[6];
        csvUtterance.tag = currentLine[7];
        this.result.push(csvUtterance);
      } else {
        console.log('Error occured while reading file on line ' + i + '.');
      }

    }

  }
  selectionChanged(event: any) {

    console.log(this.selectedTestdata)
    console.log(this.selectedTrainingsdata)

  }
/**
 * browse the GT's utterances and create a new GT csv as string
 * @return Array of GT's Lines
 * @param utterances 
 */
  refreshUtterances(utterances: CsvUtterance[]) {
    let entriesArray = [];
    for (let i = 0; i < utterances.length; i++) {
      let entries = [];
      entries[0] = "" + (i + 1);
      entries[1] = utterances[i].transcript;
      entries[2] = utterances[i].category;
      entries[3] = utterances[i].literal;
      entries[4] = utterances[i].startIndex;
      entries[5] = utterances[i].endIndex;
      entries[6] = utterances[i].intent;
      entries[7] = utterances[i].tag;
      entriesArray.push(entries.join(";").replace(/-/gi, ""));
    }
    entriesArray.unshift(HEADERS.join(";"));

    return entriesArray;
  }
/**
 * 
 * Select all @param trainOrTest Intent with name @param intent 
 * 
 */
  selectIntents(intent: string, trainOrTest: number) { // train = 0 , test = else

    if (trainOrTest == 0) 
    {
      this.result.forEach(element => { if (element.intent == intent && !this.isTestdata(element)) { this.selectedTrainingsdata.push(element) } });
    }
    else 
    {
      this.result.forEach(element => { if (element.intent == intent && !this.isTraindata(element)) { this.selectedTestdata.push(element) } });
    }
  }
/**
 * 
 * Deselect all @param trainOrTest Intent with name @param intent 
 * 
 */
  deselectIntents(intent: string, trainOrTest: number) {
    if (trainOrTest == 0) {
      this.selectedTrainingsdata = this.selectedTrainingsdata.filter(element => element.intent != intent || element.locked);
    }
    else {
      this.selectedTestdata = this.selectedTestdata.filter(element => element.intent != intent || element.locked);
    }
  }
/**
 * make all intent buttons as no selected
 */
  deselectAllIntentButtons() {
    this.intentsSelectionTestdata.forEach(data => data = false);
  }

  getTestIntents(): string[] {
    let temp = this.result.map(element => element.intent);
    temp = [...new Set(temp)];
    temp.forEach(element => this.intentsSelectionTestdata.push(false));
    return temp;
  }
/**
 * Delete actual App
 */
  deleteApp() {
    this.luisService.deleteApp(this.deleteApp.name, true)
    this.reset();
  }
/**
 * Change Style 
 */
  createAppState() {
    this.luisApp.created == 0 ? this.timelineStyle.step1.state = 'success' : this.timelineStyle.step1.failed ? this.timelineStyle.step1.state = 'error' : this.timelineStyle.step1.state = 'not-started'
    return this.timelineStyle.step1.state;
  }

  getTrainIntents(): string[] {
    let temp = this.result.map(element => element.intent);
    temp = [...new Set(temp)];
    temp.forEach(element => this.intentsSelectionTraindata.push(false));
    return temp;
  }
/**
 * Update a App
 */
  updateApp() {

    
    if (this.selectedTrainingsdata.length != 0) // SELECT TRAIN DATA
    {
      let csv = this.refreshUtterances(this.selectedTrainingsdata).join("\n");
      this.convertService.convertCsvToJson(csv, this.luisApp.name, this.luisApp.description, this.luisApp.version)
        .subscribe(data => {

          this.luisService.updateApp(this.luisApp.name).subscribe(
            data => {
              this.luisApp.created = 0;
              this.luisApp.updated = 1;
              this.showNotification(`The app ${this.luisApp.name} has been successfully updated.`, null, NotificationType.Info);
            },
            (error) => {
              this.timelineStyle.step1.failed = true;
              this.timelineStyle.step1.state = "error";

              this.showNotification("Error while updating app. Please contact an administrator or see details for more information.", error.message, NotificationType.Danger);
            });
        });
    }

    if (this.selectedTestdata.length != 0) // SELECT Test DATA GT
    { 
      let csv = this.refreshUtterances(this.selectedTestdata).join("\n");
      this.persistentService.testData(csv, this.luisApp.name)
        .subscribe(data => {
          this.json = JSON.stringify(data, null, 5);
        });
    }

    this.timelineStyle.step1.state = this.createAppState();
  }
  /**
   * Create new App
   */
  createApp() {
    if (this.selectedTrainingsdata.length != 0) // SELECT TRAIN DATA
    {
      let csv = this.refreshUtterances(this.selectedTrainingsdata).join("\n");
      this.convertService.convertCsvToJson(csv, this.luisApp.name, this.luisApp.description, this.luisApp.version)
        .subscribe(data => {
          this.luisService.createApp(this.luisApp.name).subscribe(
            data => {
              let createdApp = JSON.parse(data.body);
              this.luisApp.id = createdApp.appID;
              this.luisApp.version = createdApp.version;
              this.luisApp.description = createdApp.description;
              this.luisApp.name = createdApp.name;
              this.luisApp.created = 0;
              this.showNotification(`The app ${this.luisApp.name} has been successfully created.`, null, NotificationType.Info);
            },
            (error) => {
              this.timelineStyle.step1.failed = true;
              this.timelineStyle.step1.state = "error";

              this.showNotification("Error while creating app. Please contact an administrator or see details for more information.", error.message, NotificationType.Danger);
            });
        });
    }
    if (this.selectedTestdata.length != 0 && !this.uploadedFile.exist) // SELECT Test DATA GT
    {
      let csv = this.refreshUtterances(this.selectedTestdata).join("\n");
      this.persistentService.testData(csv, this.luisApp.name)
        .subscribe(data => {
          this.json = JSON.stringify(data, null, 5);
        });
    }
    else if (this.selectedTestdata.length == 0 && this.uploadedFile.exist) // SELECT Uploaded Test DATA
    {
      console.log(this.uploadedFile.content)
      this.persistentService.testData(this.uploadedFile.content, this.luisApp.name)
        .subscribe(data => {
          this.json = JSON.stringify(data, null, 5);
        });
    }
    else if (this.selectedTestdata.length == 0 && !this.uploadedFile.exist) // SKIP
    {
      let csv = this.refreshUtterances(this.selectedTrainingsdata).join("\n");
      this.persistentService.autoData(csv, this.luisApp.name, this.luisApp.version, this.luisApp.description, this.luisApp.culture)
        .subscribe(data => {
          this.json = JSON.stringify(data, null, 5);

        });
    }

    this.timelineStyle.step1.state = this.createAppState();
  }
/**
 * Train your App
 */
  train() {
    this.trained = true;
    this.timelineStyle.step2.state = "processing";
    this.luisService.trainApp(this.luisApp.name).subscribe(
      data => {
        this.luisApp.trained = 0;
        this.trained = false;
        this.timelineStyle.step2.state = "success";
        this.timelineStyle.step3.state = "current";
      },
      (error) => {
        this.timelineStyle.step2.failed = true;
        this.showNotification("Error while training app. Please contact an administrator or see details for more information.", error.message, NotificationType.Danger);
      }

    );

  }
/**
 * Publish your App
 */
  publish() {
    this.luisService.publish(this.luisApp.name, this.luisApp.isStaging).subscribe(
      data => {
        let app: any = data;
        this.luisApp.published = 0;
        this.luisApp.region = app.region;
        this.luisApp.url = app.endpointUrl;
        this.luisApp.isStaging = app.isStaging;
        this.luisApp.publishedDateTime = app.publishedDateTime;
        this.timelineStyle.step4.state = 'current';
      },
      (error) => {
        this.timelineStyle.step3.failed = true;
        this.showNotification("Error while publishing app. Please contact an administrator or see details for more information.", error.message, NotificationType.Danger);
      }
    );
    this.luisService.getAppInfo(this.luisApp.name).subscribe(
      data => {
        let app = JSON.parse(data.body);
        this.luisApp.isStaging = app.isStaging;
        this.luisApp.publishedDateTime = app.lastModifiedDateTime;
      },
      (error) => {
        this.showNotification("Error while retieving app information. Please contact an administrator or see details for more information.", error.message, NotificationType.Danger);
      }
    );
    this.luisService.getPublishSettings(this.luisApp.name)
      .subscribe(
        data => {
          let settings = JSON.parse(data.body);
          this.luisApp.settings.sentimentAnalysis = settings.sentimentAnalysis;
          this.luisApp.settings.speech = settings.speech;
          this.luisApp.settings.spellChecker = settings.spellChecker;
        },
        (error) => {
          this.showNotification("Error while retieving PublishSettings. Please contact an administrator or see details for more information.", error.message, NotificationType.Danger);
        }
      );

  }
/**
 * Test your App
 */
  test() {
    this.timelineStyle.step4.state = 'processing';
    this.luisService.batchTestApp(this.luisApp.name, 'all').subscribe(appStats => {
      this.timelineStyle.step4.state = 'success'; ''
      this.luisApp.tested = 0;
      this.showNotification(`The app ${this.luisApp.name} has been tested successfully.`, null, NotificationType.Info);
    },
      (error) => {
        this.timelineStyle.step4.state = 'error';
        this.showNotification("Error while testing app. Please contact an administrator or see details for more information.", error.message, NotificationType.Danger);
      });
  }
/**
 * Change Publish Settings
 */
  updatePublishSetting() {
    this.luisService.updatePublishSettings(this.luisApp.name, this.luisApp.settings.sentimentAnalysis, this.luisApp.settings.speech, this.luisApp.settings.spellChecker)
      .subscribe(data => { console.log(data) });
  }
/**
 * Load a csv File for Test data
 * @param event 
 */
  readCsvFile(event: any) {

    let fileList: FileList = event.target.files;
    let file = fileList.item(0);
    // Initialize Object properties
    this.uploadedFile = {
      exist: false,
      content: '',
      name: ''
    }

    let fileReader = new FileReader();
    fileReader.readAsText(file);
    if ((file.name.endsWith(".csv"))) // Reading csv file
    {
      this.uploadedFile.exist = true;

      fileReader.onload = () => {
        let data = fileReader.result;
        this.uploadedFile.content = (<string>data);
        this.uploadedFile.name = fileList.item(0).name;
      }

      fileReader.onerror = () => {
        this.showNotification("Error occured while reading file!", null, NotificationType.Danger);
        this.uploadedFile = {
          exist: false,
          content: '',
          name: fileList.item(0).name
        }
      };
    }
  }
  isTraindata(utterance: CsvUtterance) {
    return this.selectedTrainingsdata.indexOf(utterance) != -1
  }
  isTestdata(utterance: CsvUtterance) {
    return this.selectedTestdata.indexOf(utterance) != -1

  }
  showNotification(message: string, messageDetails: string, type: NotificationType) {
    this.notificationService.add(
      new Notification(
        type,
        message,
        messageDetails
      )
    )
  }

  reset() {
    this.json = "";
    this.luisApp =
    {
      name: '',
      description: '',
      culture: 'de-de',
      id: '',
      url: '',
      version: '1.0',
      created: 1,
      region: '',
      publishedDateTime: '',
      trained: 1,
      tested: 1,
      updated:1,
      published: 1,
      settings: { sentimentAnalysis: false, speech: false, spellChecker: false },
      isStaging: false,
    };
    this.intents = [];
    this.intentsSelectionTestdata = [];
    this.selectedTrainingsdata = [];
    this.selectedTestdata = []; 
    this.intentsSelectionTraindata = [];
    this.intents = this.getTestIntents();
    this.intents = this.getTrainIntents();
    this.timelineStyle = {
      step0: { state: "current", open: true, failed: false },
      step1: { state: "not-started", open: false, failed: false },
      step2: { state: "not-started", open: false, failed: false },
      step3: { state: "not-started", open: false, failed: false },
      step4: { state: "not-started", open: false, failed: false },
    };
  }
}

function appNameValidator(existingAppNames: string[]): ValidatorFn {
  return (control: FormControl) => {
    if (!control) {
      return null;
    }

    return existingAppNames.includes(control.value) ? { exists: true } : null;
  };

}