import { Component, OnInit, ViewChild } from '@angular/core';
import { Utterance, HEADERS } from 'src/app/models/Utterance';
import { LuisAppService } from 'src/app/services/luis-app.service';
@Component({
  selector: 'app-csv-reader',
  templateUrl: './csv-reader.component.html',
  styleUrls: ['./csv-reader.component.scss']
})
export class CsvReaderComponent implements OnInit {
  @ViewChild('csvReader') csvReader: any;

  file: File = null;
  fileName = "No File Choosen";
  fileAsJson : string = "No File Choosen";
  fileAsCsvString : string = "";
  selectedUtterance: Utterance = null;
  result: Utterance[] = [];
  delimiter: string = ';';
  modalOpenedforNewLine=false;
  modalOpenedforDelimitor=false;
  printText=false;
  isJsonFile=false;
  newLine:Utterance = new Utterance();
  buttonsHidden=false;
  buttonsHiddenStyle="btn-group-overflow close";
  constructor(private luisService:LuisAppService) { }

  ngOnInit(): void {
  }
  moreButton()
  {
    this.buttonsHidden=!this.buttonsHidden;
    return this.buttonsHidden? "btn-group-overflow open" : "btn-group-overflow close";
  }
  createUtterances() : void
  {
    this.result = [];
    let dataArray: string[] = this.fileAsCsvString.split(/\r\n|\n/);
    let headers = dataArray[0].split(this.delimiter);
    if (arrayEquals(headers, HEADERS)) {
      
      for (let i = 1; i < dataArray.length; i++) {
        let currentLine = dataArray[i].split(this.delimiter);
        if (currentLine.length == headers.length) {
          let utterance: Utterance = new Utterance();
          utterance.id = currentLine[0];
          utterance.transcript = currentLine[1];
          utterance.category = currentLine[2];
          utterance.literal = currentLine[3];
          utterance.startIndex = currentLine[4];
          utterance.endIndex = currentLine[5];
          utterance.intent = currentLine[6];
          this.result.push(utterance);
        } else {
          console.log('Error occured while reading file on line ' + i + '.');
        }
      }
    } else {
      console.log('Error occured while reading file. Found different Headers!');
      this.resetFile();
    }
  }
  readCsvFile(event: any) {

    let fileList: FileList = event.target.files;
    this.file = fileList.item(0);
    this.fileName = fileList.item(0).name;

    if (!((this.file.name.endsWith(".csv"))||(this.file.name.endsWith('.json')) ))
    {
      this.file = null;
      console.log('Error occured while reading file. Please import valid .csv or .json file!');
    }
    else
    {
      let fileReader = new FileReader();
      fileReader.readAsText(this.file);
      if((this.file.name.endsWith(".csv"))) // Reading csv file
      {
        fileReader.onload = () => {
          let data = fileReader.result;
          this.printText=true;
          this.fileAsCsvString = (<string>data);
          this.createUtterances();
          this.convertToJSON();
       }
       fileReader.onerror = () => {
         console.log('Error occured while reading file!');
         this.resetFile();
       };
      }
      else if ((this.file.name.endsWith(".json"))) // Reading Json file
      {
        this.isJsonFile = true;
        fileReader.onload = () => {
          let data = fileReader.result;
          this.fileAsJson = (<string>data);
          this.convertToCSV();          
        }
        fileReader.onerror = () => {
          console.log('Error occured while reading file!');
          this.resetFile();
        };
      }
    }
  }

  resetFile() {
    
    this.file = null;
    this.result = [];
  }

  editUtterance(utterance: Utterance){
    utterance = Object.assign(this.selectedUtterance);
    this.selectedUtterance = null;
  }

  deleteUtterance(utterance: Utterance)
  {
    let j = this.result.indexOf(utterance);
    if(j > -1)
    {
        this.result.splice(j,1);        
    } 
  }
  insertUtterance(utterance: Utterance)
  {
    this.result.push(utterance);
    this.isJsonFile = false;
    this.newLine = new Utterance();
  }
  changeDelimiter(event: any)
  {
      let delimiter = event.target.value;
      if(this.delimiter.trim() != delimiter.trim())
      {
          if(this.file != null)
          {
            this.fileAsCsvString =  this.fileAsCsvString.split(this.delimiter).join(delimiter).trim(); // Replace all characters          
            this.delimiter = delimiter; 
          }
          console.log(this.fileAsCsvString)
      }
  }
  /**
  * download currently csv file
  * 
  */
downloadCsv() 
{
    this.fileAsCsvString = this.refreshUtterances(this.result);
    this.convertToCSV();
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(this.fileAsCsvString);
    hiddenElement.target = '_blank';
    hiddenElement.download = (this.fileName.endsWith(".csv"))? this.fileName.substring(0, this.fileName.length-3)+"csv": this.fileName.substring(0, this.fileName.length-4)+"csv";
    hiddenElement.click();
}
 /**
  * download currently json file
  * 
  */
 downloadJson() 
 {
     this.fileAsCsvString = this.refreshUtterances(this.result);
     this.convertToJSON();
     var hiddenElement = document.createElement('a');
     hiddenElement.href = 'data:text/json;charset=UTF-8,' + encodeURIComponent(this.fileAsJson);
     hiddenElement.target = '_blank';
     hiddenElement.download = (this.fileName.endsWith(".csv"))? this.fileName.substring(0, this.fileName.length-3)+"json": this.fileName.substring(0, this.fileName.length-4)+"json";
     hiddenElement.click();
 }
  refreshUtterances( utterances: Utterance[]):string
  {
      let entriesArray = [];
      for (let i = 0; i < utterances.length; i++) 
      {  
         let entries = [];
          entries[0] = utterances[i].id;
          entries[1] = utterances[i].transcript;
          entries[2] = utterances[i].category;
          entries[3] = utterances[i].literal;
          entries[4] = utterances[i].startIndex;
          entries[5] = utterances[i].endIndex;
          entries[6] = utterances[i].intent;
          
          entriesArray.push(entries.join(this.delimiter).replace(/-/gi,""));
      }  
      entriesArray.unshift(HEADERS);
      this.fileAsCsvString = entriesArray.join('\n');
      return entriesArray.join('\n');
  }
  convertToCSV()
  {
    this.luisService.convertJsonToCSV(this.fileAsJson)
    .toPromise().then(data=>{this.fileAsCsvString = data ; this.createUtterances();});
   
  }
  convertToJSON()
  { 

      this.luisService.convertCsvToJson(this.fileAsCsvString)
      .toPromise().then(data=>{this.fileAsJson = JSON.stringify(data, null,5);});
  }


}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length 
    //&& a.every((val, index) => val === b[index]); // # != number => error
}