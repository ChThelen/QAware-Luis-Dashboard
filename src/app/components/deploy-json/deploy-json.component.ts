import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HEADERS, CsvUtterance } from 'src/app/models/CsvUtterance';
import { ConvertService } from 'src/app/services/convert.service';
import { LuisAppService } from 'src/app/services/luis-app.service';
import { PersistentService } from 'src/app/services/persistent.service';
import { ClrLoadingState } from '@clr/angular';

@Component({
  selector: 'app-deploy-json',
  templateUrl: './deploy-json.component.html',
  styleUrls: ['./deploy-json.component.scss']
})
export class DeployJsonComponent implements OnInit {
  
  trained = false;
  intents: string[] = [];
  intentsSelectionTestdata: boolean[] = [];
  intentsSelectionTraindata: boolean[] = [];
  result: CsvUtterance[] = [];
  selectedTestdata: CsvUtterance[] = [];
  selectedTrainingsdata: CsvUtterance[] = [];
  selectedTestdataJson : string = "";
  selectedTrainingsdataJson :string = ""; 
  groundTruth: string = "";
  addTrainData = true; 
  addTestData = false;
  layout = {
    direction : "vertical", 
    block1 : "clr-col-lg-3 clr-col-12 ",
    block2 : "clr-col-lg-9 clr-col-12 ",
  }

  uploadedFile = {
    exist : false,
    json : false, 
    csv : false,
    content : '',
    name : ''
  }
  validateBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  submitBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  data =  {
    type:'train',
    uploadedFile:false
  };

  timelineStyle = {
    step0: { state: "current", open: true ,failed: false},
    step1: { state: "not-started", open: false , failed: false},
    step2: { state: "not-started", open: false,failed: false },
    step3: { state: "not-started", open: false,failed: false },
    step4: { state: "not-started", open: false,failed: false },
  };
  luis = {
    app:
    {
      name: '',
      description: '',
      culture:'de-de',
      id: '',
      url : '',
      version: '1.0',
      created: 1,
      region:'',
      publishedDateTime: '',
      trained: 1,
      published: 1,
      settings:{sentimentAnalysis:false,speech:false,spellChecker:false},
      isStaging: false,
    }
  };
  
  constructor(
    private luisService: LuisAppService,
    private persistentService: PersistentService,
    private convertService: ConvertService) {
    this.createUtterances(this.groundTruth, this.result);
    this.intents = this.getIntents(0);
    this.intents = this.getIntents(1);
    persistentService.getGT().subscribe(data => this.groundTruth = data);
  }

  ngOnInit(): void {
    this.persistentService.getGT().subscribe(data => { this.groundTruth = data; 
    this.createUtterances(this.groundTruth, this.result); 
    this.intents = this.getIntents(0);
    this.intents = this.getIntents(1); 
  });

  }
  changeToHorizonTal()
  {
    this.layout = {
      direction : "horizontal", 
      block1 : "clr-col-lg-12 clr-col-12 height container",
      block2 : "clr-col-lg-12 clr-col-12 container",
    }
  }
  changeToVertical()
  {
    this.layout = {
      direction : "vertical", 
      block1 : "clr-col-lg-3 clr-col-12 ",
      block2 : "clr-col-lg-9 clr-col-12 ",
    }
  }
  createUtterances(file: string, result: CsvUtterance[]): void {

    let dataArray: string[] = file.split(/\r\n|\n/);
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
        result.push(csvUtterance);
      } else {
        console.log('Error occured while reading file on line ' + i + '.');
      }

    }

  }
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
  selectIntents(intent: string, trainOrTest:number) { // train = 0 , test = else
    if(trainOrTest == 0)
    {
      this.result.forEach(element => { if (element.intent == intent) { this.selectedTrainingsdata.push(element) } });
    }
    else
    {
      this.result.forEach(element => { if (element.intent == intent) { this.selectedTestdata.push(element) } });
    }
  }
  deselectIntents(intent: string, trainOrTest:number) {
    if(trainOrTest == 0)
    {
      this.selectedTrainingsdata = this.selectedTrainingsdata.filter(element => element.intent != intent);
    }
    else
    {
      this.selectedTestdata = this.selectedTestdata.filter(element => element.intent != intent);
    }
  }
  deselectAllIntentButtons()
  {
    this.intentsSelectionTestdata.forEach(data => data=false);
  }
  /**
   *  To generate Intents Buttons 
   * @param trainOrTest 
   */
  getIntents(trainOrTest:number): string[] 
  {
    if(trainOrTest)
    {
      let temp = this.result.map(element => element.intent);
      temp = [...new Set(temp)];
      temp.forEach(element => this.intentsSelectionTestdata.push(false));
      return temp;
    }
    else
    {
      let temp = this.result.map(element => element.intent);
      temp = [...new Set(temp)];
      temp.forEach(element => this.intentsSelectionTraindata.push(false));
      return temp;
    }
    
  }
  selectionChanged(event: any) 
  {

  }
  createApp() 
  {
    if (this.luis.app.created === 1) // App hasn't been created
    {
      let json = '';
      if(!this.uploadedFile.exist)
      {
        json = this.addUtterances();
      }
      else
      {
        json = this.uploadedFile.content; 
      }
     
      json = this.editNameAndDescription(json);
      this.luisService.createApp(json).subscribe(
        data => { 
        let createdApp = JSON.parse(data.body);
        this.luis.app.id = createdApp.appID;
        this.luis.app.version = createdApp.version;
        this.luis.app.name = createdApp.name;
        this.luis.app.created = 0;
          //TODO : Notification Message  
      },
      err => {
        this.timelineStyle.step1.state = "error";
        let error = JSON.parse(err);
        console.log(error)
        this.timelineStyle.step1.failed = true;
        //TODO : Error Message
      });
 
    }
 
  
  }
  train() {
    this.trained = true;
    this.timelineStyle.step2.state = "processing";
    this.luisService.trainApp(this.luis.app.name).subscribe(
    data => { 
     this.luis.app.trained = 0;
      // NOTIFICATION 

      this.trained = false;
      this.timelineStyle.step2.state = "success";
      this.timelineStyle.step3.state = "current";
    },
    err => {
      this.timelineStyle.step2.failed = true;
      // NOTIFICATION
    }

    );
    
  }

  publish() {
    this.luisService.publish(this.luis.app.name, this.luis.app.isStaging).subscribe(
      data => {
        this.luis.app.published = 0;
        // NOTIFICATION
        console.log(data)
      /*  let app = JSON.parse(data);  
        this.luis.app.region = app.region; 
        this.luis.app.url = app.endpointUrl; 
        this.luis.app.isStaging = app.isStaging; 
        this.luis.app.publishedDateTime = app.publishedDateTime;
        console.log(this.luis.app) */
        this.timelineStyle.step4.state = 'current';
       },
       err => {
        this.timelineStyle.step3.failed = true;
         // NOTIFICATION
       }
    );
    this.luisService.getAppInfo(this.luis.app.name).subscribe(
      data => {
        let info = data; 
        console.log(data)
        console.log("data")
       },
       err => {
         // NOTIFICATION
       }
    );
    this.luisService.getPublishSettings(this.luis.app.name)
    .subscribe(
      data => {
        let settings = JSON.parse(data.body);
        this.luis.app.settings.sentimentAnalysis = settings.sentimentAnalysis;
        this.luis.app.settings.speech = settings.speech;
        this.luis.app.settings.spellChecker = settings.spellChecker;
        console.log(data.body)
        // NOTIFICATION
        
       },
       err => {
         // NOTIFICATION
       }
    );
 
  }

/**
 * 
 * @param jsonString 
 * @returns the same json but with another name and description
 */
  editNameAndDescription(jsonString) 
  {
    
    if (this.luis.app.name.trim() != "") {
      let startIndex = jsonString.split(/\r\n|\n/).join("").lastIndexOf('\"name\"');
      let endIndex = jsonString.split(/\r\n|\n/).join("").indexOf(",", startIndex) + 1;
      let oldName = jsonString.split(/\r\n|\n/).join("").substring(startIndex, endIndex);
      let newName = '\"name\":' + ' \"' + this.luis.app.name.trim() + "\",";
      jsonString = jsonString.replace(oldName, newName);
    }
    if (this.luis.app.description.trim() != "") {
      let startIndex = jsonString.split(/\r\n|\n/).join("").lastIndexOf('\"desc\"');
      let endIndex = jsonString.split(/\r\n|\n/).join("").indexOf(",", startIndex) + 1;
      let oldDesc = jsonString.split(/\r\n|\n/).join("").substring(startIndex, endIndex);
      let newDesc = '\"desc\":' + ' \"' + this.luis.app.description.trim() + "\",";
      jsonString = jsonString.replace(oldDesc, newDesc);
    }
    return jsonString;
  }
  
  addUtterances() 
  {
    let json = "";
    if(!this.uploadedFile.exist)
    {
     
      if(this.selectedTrainingsdata.length!= 0) // SELECT TRAIN DATA
      {
        let csv = this.refreshUtterances(this.selectedTrainingsdata).join("\n");
        this.convertService.convertCsvToJson(csv, this.luis.app.name)
        .toPromise().then(data => { this.selectedTrainingsdataJson = JSON.stringify(data, null, 5);
          console.log(this.selectedTrainingsdataJson); json = JSON.stringify(data, null, 5); });
        console.log(this.selectedTrainingsdataJson)
      }
      if(this.selectedTestdata.length!= 0) // SELECT Test DATA
      {
        let csv = this.refreshUtterances(this.selectedTestdata).join("\n");
        this.persistentService.testData(csv, "MyJsonFile_" + new Date().toDateString())
        .toPromise().then(data => { this.selectedTestdataJson = JSON.stringify(data, null, 5); });
      }
      else if(this.selectedTestdata.length == 0) // SKIP
      {
        let csv = this.refreshUtterances(this.selectedTrainingsdata).join("\n");
        this.persistentService.autoData(csv, this.luis.app.name,this.luis.app.version,this.luis.app.description,this.luis.app.culture)
        .toPromise().then(data => { this.selectedTrainingsdataJson = JSON.stringify(data, null, 5); });
      }
     
    } 
    return json;
  }

  readCsvFile(event: any) 
  {

    let fileList: FileList = event.target.files;
    let file = fileList.item(0);
      // Initialize Object properties
      this.uploadedFile = {
        exist : false,
        json : false, 
        csv : false,
        content : '',
        name : fileList.item(0).name
      }

      let fileReader = new FileReader();
      fileReader.readAsText(file);
      if ((file.name.endsWith(".csv"))) // Reading csv file
      {
        this.uploadedFile.csv = true;
        this.uploadedFile.exist = true;

        fileReader.onload = () => {
          let data = fileReader.result;
          this.uploadedFile.content = (<string>data);
         
          // convert in json
          this.convertService.convertCsvToJson(this.uploadedFile.content, "MyJsonFile_" + new Date().toDateString())
               .toPromise().then(data => { this.uploadedFile.content = JSON.stringify(data, null, 3); });
        }
        fileReader.onerror = () => {
          console.log('Error occured while reading file!');
           //TODO : NOTIFICATION
        };
      }
      else if ((file.name.endsWith(".json"))) // Reading csv file
      {
        this.uploadedFile.json = true;
        this.uploadedFile.exist = true;

        fileReader.onload = () => {
          let data = fileReader.result;
          this.uploadedFile.content = (<string>data);
          this.uploadedFile.content = JSON.parse(this.uploadedFile.content);
          this.uploadedFile.content = JSON.stringify(this.uploadedFile.content, null, 3); 
        }
        fileReader.onerror = () => {
          console.log('Error occured while reading file!');
          //TODO : NOTIFICATION
        };
      }

  
  }
  
}
