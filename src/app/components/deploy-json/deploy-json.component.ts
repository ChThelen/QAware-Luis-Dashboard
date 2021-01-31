import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HEADERS, CsvUtterance } from 'src/app/models/CsvUtterance';
import { LuisAppService } from 'src/app/services/luis-app.service';
import { ClrLoadingState } from '@clr/angular';

@Component({
  selector: 'app-deploy-json',
  templateUrl: './deploy-json.component.html',
  styleUrls: ['./deploy-json.component.scss']
})
export class DeployJsonComponent implements OnInit {
  
  appCreated = false;
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
    step0: { state: "current", open: true },
    step1: { state: "not-started", open: false },
    step2: { state: "not-started", open: false },
    step3: { state: "not-started", open: false },
    step4: { state: "not-started", open: false },
  };
  luis = {
    app:
    {
      name: '',
      description: '',
      culture:'de-de',
      id: '',
      version: '1.0',
      created: 1,
      trained: 1,
      published: 1,
      staging: true,
      production: false
    }
  };
  
  closeStep() {
    this.timelineStyle = {
      step0: { state: "current", open: false },
      step1: { state: "not-started", open: false },
      step2: { state: "not-started", open: false },
      step3: { state: "not-started", open: false },
      step4: { state: "not-started", open: false },
    };
  }
  constructor(private luisService: LuisAppService) {
    this.createUtterances(this.groundTruth, this.result);
    this.intents = this.getIntents(0);
    this.intents = this.getIntents(1);
    luisService.getGT().subscribe(data => this.groundTruth = data);
  }

  ngOnInit(): void {
    this.luisService.getGT().subscribe(data => { this.groundTruth = data; 
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
    let appCreated = false;
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
          
      },
      err => {
        
        let error = JSON.parse(err);
        console.log(error)
      });
 
    }
 
  
  }
  train() {
    this.luisService.trainApp("").subscribe(data => { 
      this.luis.app.trained = <number> data.body;
    });
    
    this.luis.app.trained = 0;
    if (this.luis.app.trained == 0) // App is trained
    {
     
    }
    else // App isn't trained
    {

      //TODO : User must be notify 
    }
  }
  publish() {
    this.luisService.publish("this.jsonString", this.luis.app.staging).subscribe(data => { this.luis.app.published = data });
    this.luis.app.published = 0;
    if (this.luis.app.published == 0) // App is published
    {
      
    }
    else // App isn't published
    {
      //TODO : User must be notify 
    }
  }

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
    if(!this.uploadedFile.exist)
    {
      if(this.selectedTrainingsdata.length!= 0) // SELECT TRAIN DATA
      {
        let csv = this.refreshUtterances(this.selectedTrainingsdata).join("\n");
        this.luisService.convertCsvToJson(csv, this.luis.app.name)
        .toPromise().then(data => { this.selectedTrainingsdataJson = JSON.stringify(data, null, 5); });
  
      }
      if(this.selectedTestdata.length!= 0) // SELECT Test DATA
      {
        let csv = this.refreshUtterances(this.selectedTestdata).join("\n");
        this.luisService.testData(csv, "MyJsonFile_" + new Date().toDateString())
        .toPromise().then(data => { this.selectedTestdataJson = JSON.stringify(data, null, 5); });
      }
      if(this.selectedTestdata.length == 0)
      {
        let csv = this.refreshUtterances(this.selectedTrainingsdata).join("\n");
        this.luisService.autoData(csv, this.luis.app.name,this.luis.app.version,this.luis.app.description,this.luis.app.culture)
        .toPromise().then(data => { this.selectedTrainingsdataJson = JSON.stringify(data, null, 5); });
      }
     
    } 
    return this.selectedTrainingsdataJson;
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
          this.luisService.convertCsvToJson(this.uploadedFile.content, "MyJsonFile_" + new Date().toDateString())
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
