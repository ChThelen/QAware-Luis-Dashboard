import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HEADERS, CsvUtterance } from 'src/app/models/CsvUtterance';
import { LuisAppService } from 'src/app/services/luis-app.service';

@Component({
  selector: 'app-deploy-json',
  templateUrl: './deploy-json.component.html',
  styleUrls: ['./deploy-json.component.scss']
})
export class DeployJsonComponent implements OnInit {

  jsonString: string;
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

  uploadedFile = {
    exist : false,
    json : false, 
    csv : false,
    content : '',
    name : ''
  }


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
      id: '',
      version: '',
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
  createApp() {
    this.luisService.createApp(this.jsonString).subscribe(data => { this.luis.app.id = data; console.log(data) });
    this.luis.app.created = 0;
    if (this.luis.app.id.length > 5 || this.luis.app.created == 0) // App has been created
    {
      this.manageTimeLineStyle();

    }
    else // App isn't created or already existing
    {
      //TODO : User must be notify 
    }
  }
  train() {
    this.luisService.trainApp(this.jsonString).subscribe(data => { 
      this.luis.app.trained = <number> data.body;
    });
    
    this.luis.app.trained = 0;
    if (this.luis.app.trained == 0) // App is trained
    {
      this.manageTimeLineStyle();
    }
    else // App isn't trained
    {

      //TODO : User must be notify 
    }
  }
  publish() {
    this.luisService.publish(this.jsonString, this.luis.app.staging).subscribe(data => { this.luis.app.published = data });
    this.luis.app.published = 0;
    if (this.luis.app.published == 0) // App is published
    {
      this.manageTimeLineStyle();
    }
    else // App isn't published
    {
      //TODO : User must be notify 
    }
  }

  manageTimeLineStyle() {
    if (this.luis.app.created == 0 && this.luis.app.trained == 1 && this.luis.app.published == 1) {
      this.timelineStyle.step1.state = "success";
      this.timelineStyle.step2.state = "current";
    }
    else if (this.luis.app.trained == 0 && this.luis.app.published == 1) {
      this.timelineStyle.step2.state = "success";
      this.timelineStyle.step3.state = "current";
    }
    if (this.luis.app.published == 0) {
      this.timelineStyle.step3.state = "success";
      this.timelineStyle.step4.state = "current";
    }
  }
  editNameAndDescription(name: string, description: string) {

    if (this.luis.app.name.trim() != "") {
      let startIndex = this.jsonString.split(/\r\n|\n/).join("").lastIndexOf('\"name\"');
      let endIndex = this.jsonString.split(/\r\n|\n/).join("").indexOf(",", startIndex) + 1;
      let oldName = this.jsonString.split(/\r\n|\n/).join("").substring(startIndex, endIndex);
      let newName = '\"name\":' + ' \"' + name.trim() + "\",";
      this.jsonString = this.jsonString.replace(oldName, newName);
    }
    if (this.luis.app.description.trim() != "") {
      let startIndex = this.jsonString.split(/\r\n|\n/).join("").lastIndexOf('\"desc\"');
      let endIndex = this.jsonString.split(/\r\n|\n/).join("").indexOf(",", startIndex) + 1;
      let oldDesc = this.jsonString.split(/\r\n|\n/).join("").substring(startIndex, endIndex);
      let newDesc = '\"desc\":' + ' \"' + description.trim() + "\",";
      this.jsonString = this.jsonString.replace(oldDesc, newDesc);
    }
  }

  convertSelectedUtterancesToJson(): void 
  {
   
    if(this.selectedTrainingsdata.length!= 0)
    {
      let selectedTrainingsdata = this.refreshUtterances(this.selectedTrainingsdata).join("\n");
      this.luisService.convertCsvToJson(selectedTrainingsdata, "MyJsonFile_" + new Date().toDateString())
      .toPromise().then(data => { this.selectedTrainingsdataJson = JSON.stringify(data, null, 5); });

    }
    if(this.selectedTestdata.length!= 0)
    {
      let selectedTestdata = this.refreshUtterances(this.selectedTestdata).join("\n");
      this.luisService.convertCsvToJson(selectedTestdata, "MyJsonFile_" + new Date().toDateString())
      .toPromise().then(data => { this.selectedTestdataJson = JSON.stringify(data, null, 5); });
    }
   
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
