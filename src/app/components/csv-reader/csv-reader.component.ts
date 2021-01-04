import { Component, OnInit, ViewChild } from '@angular/core';
import { CsvUtterance, HEADERS } from 'src/app/models/CsvUtterance';
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
  selectedCsvUtterance: CsvUtterance = null;
  result: CsvUtterance[] = [];
  delimiter: string = ';';
  modalOpenedforNewLine=false;
  modalOpenedforDelimitor=false;
  printText=true;
  isJsonFile=false;
  newLine:CsvUtterance = new CsvUtterance();
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
  createCsvUtterances() : void
  {
    this.result = [];
    let dataArray: string[] = this.fileAsCsvString.split(/\r\n|\n/);
    let headers = dataArray[0].split(this.delimiter);
    if (arrayEquals(headers, HEADERS)) {
      
      for (let i = 1; i < dataArray.length; i++) {
        let currentLine = dataArray[i].split(this.delimiter);
        if (currentLine.length == headers.length) {
          let csvUtterance: CsvUtterance = new CsvUtterance();
          csvUtterance.id = currentLine[0];
          csvUtterance.transcript = currentLine[1];
          csvUtterance.category = currentLine[2];
          csvUtterance.literal = currentLine[3];
          csvUtterance.startIndex = currentLine[4];
          csvUtterance.endIndex = currentLine[5];
          csvUtterance.intent = currentLine[6];
          this.result.push(csvUtterance);
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
          this.createCsvUtterances();
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

  editCsvUtterance(csvUtterance: CsvUtterance){
    csvUtterance = Object.assign(this.selectedCsvUtterance);
    this.selectedCsvUtterance = null;
  }

  deleteCsvUtterance(csvUtterance: CsvUtterance):void
  {
    let j = this.result.indexOf(csvUtterance);
    if(j > -1)
    {
        this.result.splice(j,1);        
    } 
  }
  insertCsvUtterance(csvUtterance: CsvUtterance):void
  {
    this.result.push(csvUtterance);
    this.isJsonFile = false;
    this.newLine = new CsvUtterance();
  }
  changeDelimiter(event: any):void
  {
      let delimiter = event.target.value;
      if(this.delimiter.trim() != delimiter.trim())
      {
          if(this.file != null)
          {
            this.fileAsCsvString =  this.fileAsCsvString.split(this.delimiter).join(delimiter).trim(); // Replace all characters          
            this.delimiter = delimiter; 
          }
      }
  }
  /**
  * download currently csv file
  * 
  */
downloadCsv() :void
{
    this.fileAsCsvString = this.refreshCsvUtterances(this.result);
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
 downloadJson() :void
 {
     this.fileAsCsvString = this.refreshCsvUtterances(this.result);
     this.convertToJSON();
     var hiddenElement = document.createElement('a');
     hiddenElement.href = 'data:text/json;charset=UTF-8,' + encodeURIComponent(this.fileAsJson);
     hiddenElement.target = '_blank';
     hiddenElement.download = (this.fileName.endsWith(".csv"))? this.fileName.substring(0, this.fileName.length-3)+"json": this.fileName.substring(0, this.fileName.length-4)+"json";
     hiddenElement.click();
 }
  refreshCsvUtterances( csvUtterance: CsvUtterance[]):string
  {
      let entriesArray = [];
      for (let i = 0; i < csvUtterance.length; i++) 
      {  
         let entries = [];
          entries[0] = csvUtterance[i].id;
          entries[1] = csvUtterance[i].transcript;
          entries[2] = csvUtterance[i].category;
          entries[3] = csvUtterance[i].literal;
          entries[4] = csvUtterance[i].startIndex;
          entries[5] = csvUtterance[i].endIndex;
          entries[6] = csvUtterance[i].intent;
          
          entriesArray.push(entries.join(this.delimiter).replace(/-/gi,""));
      }  
      entriesArray.unshift(HEADERS);
      this.fileAsCsvString = entriesArray.join('\n');
      return entriesArray.join('\n');
  }
  convertToCSV():void
  {
    if(this.file!=null)
    {
      this.luisService.convertJsonToCSV(this.fileAsJson)
      .toPromise().then(data=>{this.fileAsCsvString = data ; this.createCsvUtterances();});
    }
  }
  convertToJSON():void
  { 
    if(this.file!=null)
    {
      this.luisService.convertCsvToJson(this.fileAsCsvString,this.fileName)
      .toPromise().then(data=>{this.fileAsJson = JSON.stringify(data, null,5);});
    }
  }
  getFirstIndexOf(literal:string, transcript:string):string
  {
    let firstIndex = -1;
    if(literal != "" && transcript != "")
    {
      firstIndex = transcript.trim().indexOf(literal.trim());
    }
    this.newLine.startIndex = firstIndex == -1? "" : ""+firstIndex;
    return firstIndex == -1? "" : ""+firstIndex; 
  }
  getLastIndexOf(literal:string, transcript:string):string
  {
    if(this.getFirstIndexOf(literal.trim(),transcript) != "")
    {
      let firstIndex = transcript.trim().indexOf(literal.trim());
      let lastIndex  = firstIndex+literal.length;
      this.newLine.endIndex = lastIndex +"";
      return lastIndex + "";
    }
    else
    {
      this.newLine.endIndex = "";
      return "";
    }
  }
  cancelInsert()
  {
    this.newLine = new CsvUtterance();
  }


}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length && 
    a.every((val, index) => val === b[index]);
}