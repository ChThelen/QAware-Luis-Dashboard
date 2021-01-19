import { Component, OnInit, ViewChild } from '@angular/core';
import { Utterance, HEADERS } from 'src/app/models/Utterance';
import { LuisAppService } from 'src/app/services/luis-app.service';
import { ClrLoadingState } from '@clr/angular'; 



@Component({
  selector: 'app-ground-truth',
  templateUrl: './ground-truth.component.html',
  styleUrls: ['./ground-truth.component.scss']
})
export class GroundTruthComponent implements OnInit {

  @ViewChild('csvReader') csvReader: any;
  validateBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;
  submitBtnState: ClrLoadingState = ClrLoadingState.DEFAULT;

  file: File = null;
  fileName = "";
  uploadedFile : string = "";
  selectedUtterances:Utterance[] = []
  result: Utterance[] = [];
  uploadedUtterances: Utterance[] = [];
  delimiter: string = ';';
  modalOpenedforNewLine=false;
  newLine:Utterance = new Utterance();
  newChange: boolean = false;
  confirmSave: boolean = false; 
  disabledConfirm : boolean = false; 
  intents: string[] = [];
  intentsSelection: boolean[] = [];
  

  constructor(private luisService:LuisAppService) 
  { 
    this.createUtterances(this.groundTruth,this.result);
    this.intents = this.getIntents();
  }

  ngOnInit(): void
  {
  }

  selectIntents(intent:string)
  {
    this.result.forEach( element => {if(element.intent == intent){this.selectedUtterances.push(element)}});
  }
  deselectIntents(intent:string)
  {
    this.selectedUtterances=this.selectedUtterances.filter(element => element.intent != intent);
  }
  getIntents() : string[]
  {
    let temp = this.result.map(element => element.intent);
    temp = [...new Set(temp)];
    temp.forEach(element => this.intentsSelection.push(false)); 
    return temp;
  }
  createUtterances(file:string,result:Utterance[]) : void
  {
    
    let dataArray: string[] = file.split(/\r\n|\n/);
    let headers = dataArray[0].split(this.delimiter);
    if (arrayEquals(headers, HEADERS)) {
      let i = 1;
      for ( i = 1; i < dataArray.length; i++) {
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
          utterance.tag = currentLine[7];
          result.push(utterance);
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
          this.uploadedFile = (<string>data);
          this.createUtterances(this.uploadedFile,this.uploadedUtterances);
       }
       fileReader.onerror = () => {
         console.log('Error occured while reading file!');
         this.resetFile();
       };
      }
      
    }
  }
  merge()
  {
    this.validateBtnState = ClrLoadingState.LOADING;
      
    this.resetFile();

    this.validateBtnState = ClrLoadingState.SUCCESS;
    // TODO: Merge Method from Backend

  }
  saveChanges()
  {
    if(this.disabledConfirm)
    {
      this.validateBtnState = ClrLoadingState.LOADING;
      
      this.validateBtnState = ClrLoadingState.SUCCESS;
    }
   
  }
  resetFile() {
    
    this.file = null;
    this.uploadedFile = "";
    this.uploadedUtterances = [];
    this.fileName = "";
  }
  selectionChanged(event:any)
  {
    
    if(this.selectedUtterances.length == 0)
    {
      this.intents.forEach(element => this.intentsSelection.push(false)); 
    }
   

  }
  deleteUtterance(utterance: Utterance):void
  {
    let j = this.uploadedUtterances.indexOf(utterance);
    if(j > -1)
    {
        this.uploadedUtterances.splice(j,1);   
        this.intents = this.getIntents();     
    } 
  }

  deleteUtterances(utterance: Utterance[]):void
  {
    this.result = this.result.filter(element => !(utterance.includes(element)));
    this.newChange = true;
    this.intents = this.getIntents();
  }
  insertUtterance(utterance: Utterance):void
  {
    this.result.push(utterance);
    this.intents = this.getIntents();
    this.newLine = new Utterance();
    this.newChange = true;
  }
  /**
  * download currently csv file
  * 
  */
downloadCsv() :void
{   let fileName = "MyCsvFile" + new Date().toDateString();
    let content = this.refreshUtterances(this.selectedUtterances).join("\n");
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(content);
    hiddenElement.target = '_blank';
    hiddenElement.download = (fileName.endsWith(".csv"))? fileName.substring(0, fileName.length-3)+"csv": fileName.substring(0, fileName.length-4)+"csv";
    hiddenElement.click();
}
 /**
  * download currently json file
  * 
  */
 downloadJson() :void
 {
    let fileAsJson ="";
    let content = this.refreshUtterances(this.selectedUtterances).join("\n");
    this.luisService.convertCsvToJson(content,"MyJsonFile_"+new Date().toDateString())
        .toPromise().then(data=>{fileAsJson = JSON.stringify(data, null,5);});
  
     var hiddenElement = document.createElement('a');
     hiddenElement.href = 'data:text/json;charset=UTF-8,' + encodeURIComponent(fileAsJson);
     hiddenElement.target = '_blank';
     hiddenElement.download = (this.fileName.endsWith(".csv"))? this.fileName.substring(0, this.fileName.length-3)+"json": this.fileName.substring(0, this.fileName.length-4)+"json";
     hiddenElement.click();
 }
  refreshUtterances( utterances: Utterance[])
  {
      let entriesArray = [];
      for (let i = 0; i < utterances.length; i++) 
      {  
         let entries = [];
          entries[0] = ""+(i+1);
          entries[1] = utterances[i].transcript;
          entries[2] = utterances[i].category;
          entries[3] = utterances[i].literal;
          entries[4] = utterances[i].startIndex;
          entries[5] = utterances[i].endIndex;
          entries[6] = utterances[i].intent;
          entries[7] = utterances[i].tag;
          entriesArray.push(entries.join(this.delimiter).replace(/-/gi,""));
      }  
      entriesArray.unshift(HEADERS.join(this.delimiter));
     
      return entriesArray;
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
    this.newLine = new Utterance();
  }
  newChanges(change:boolean)
  {
    this.newChange = change; 
    console.log(change);
  }
  groundTruth : string = `#;transcript;category;literal;start_index;end_index;intent;tag
  1;Buch mir ein Taxi von Muenchen nach Berlin;vonOrt;Muenchen;21;29;BOOK;
  2;Buch mir ein Taxi von Muenchen nach Berlin;zuOrt;Berlin;35;41;BOOK;
  3;Buch mir ein Taxi von Muenchen nach Berlin;Anzahl;ein;8;11;BOOK;
  4;Ich brauche um 14 Uhr ein Taxi zuhause;datetimeV2;14 Uhr;14;20;BOOK;
  5;Ich brauche um 14 Uhr ein Taxi zuhause;Anzahl;ein;21;24;BOOK;
  6;Ich brauche um 14 Uhr ein Taxi zuhause;vonOrt;zuhause;30;37;BOOK;
  7;Ruf mir ein Taxi;Anzahl;ein;7;10;BOOK;
  8;Bestell mir ein Taxi fuer Freitag 16 Uhr;Anzahl;ein;11;14;BOOK;
  9;Bestell mir ein Taxi fuer Freitag 16 Uhr;datetimeV2;Freitag 16 Uhr;25;39;BOOK;
  10;Bestell mir ein Taxi fuer den 20.11.2020 14 Uhr;Anzahl;ein;11;14;BOOK;
  11;Bestell mir ein Taxi fuer den 20.11.2020 14 Uhr;datetimeV2;20.11.2020 14 Uhr;29;46;BOOK;
  12;Hol mir ein Taxi nach Mainz;Anzahl;ein;7;10;BOOK;
  13;Hol mir ein Taxi nach Mainz;zuOrt;Mainz;21;26;BOOK;
  14;Taxi, 12 Uhr;datetimeV2;12 Uhr;5;11;BOOK;
  15;Hol mir zwei Taxen um 22 Uhr;Anzahl;zwei;7;11;BOOK;
  16;Hol mir zwei Taxen um 22 Uhr;datetimeV2;22 Uhr;21;27;BOOK;
  17;Ruf mir ein Taxi von Wiesbaden ueber Frankfurt nach Dresden;Anzahl;ein;7;10;BOOK;
  18;Ruf mir ein Taxi von Wiesbaden ueber Frankfurt nach Dresden;vonOrt;Wiesbaden;20;29;BOOK;
  19;Ruf mir ein Taxi von Wiesbaden ueber Frankfurt nach Dresden;zuOrt;Dresden;51;58;BOOK;
  20;Ruf mir ein Taxi von Wiesbaden ueber Frankfurt nach Dresden;ueberOrt;Frankfurt;36;45;BOOK;
  21;Hol mir ein Taxi nach Essen und zurueck;Anzahl;ein;7;10;BOOK;
  22;Hol mir ein Taxi nach Essen und zurueck;zuOrt;Essen;21;26;BOOK;
  23;Hol mir ein Taxi nach Essen und zurueck;zuOrt;zurueck;31;38;BOOK;
  24;Ruf mir ein Taxi zum Essen;Anzahl;ein;7;10;BOOK;
  25;Ruf mir ein Taxi zum Essen;datetimeV2;zum Essen;16;25;BOOK;
  26;Bestell mir ein Taxi fuer morgen zu meiner Freundin;Anzahl;ein;11;14;BOOK;
  27;Bestell mir ein Taxi fuer morgen zu meiner Freundin;datetimeV2;morgen;25;31;BOOK;
  28;Bestell mir ein Taxi fuer morgen zu meiner Freundin;vonOrt;zu meiner Freundin;32;50;BOOK;
  29;Ich brauche kein Taxi mehr;;;;;CANCEL;
  30;Storniere das Taxi am Freitag fuer 16 Uhr;datetimeV2;Freitag fuer 16 Uhr;21;40;CANCEL;
  31;Bestell mein Taxi fuer den 20. November ab;datetimeV2;20. Nov;26;38;CANCEL;
  32;Bestell mein Taxi ab;;;;;CANCEL;
  33;Wann kann das naechste Taxi bei mir sein;vonOrt;bei mir;27;34;TIME;
  34;Wie lange dauert es mit dem Taxi von Ingelheim nach Wiesbaden;vonOrt;Ingelheim;36;45;TIME;
  35;Wie lange dauert es mit dem Taxi von Ingelheim nach Wiesbaden;zuOrt;Wiesbaden;51;60;TIME;
  36;Wann ist ein Taxi in Bingen;Anzahl;ein;8;11;TIME;
  37;Wann ist ein Taxi in Bingen;vonOrt;Bingen;20;26;TIME;
  38;Was kostet ein Taxi von Mainz nach Bingen;Anzahl;ein;10;13;PRICE;
  39;Was kostet ein Taxi von Mainz nach Bingen;vonOrt;Mainz;23;28;PRICE;
  40;Was kostet ein Taxi von Mainz nach Bingen;zuOrt;Bingen;34;40;PRICE;
  41;Hallo, wie geht�s;;;;;NONE;
  42;Wie wird das Wetter morgen?;;;;;NONE;
  43;Bestell mir was zu essen;;;;;NONE;
  44;Wie warm ist es in Berlin;;;;;NONE;
  45;Wann geht die Sonne auf;;;;;NONE;
  46;Wann ist das naechste Meeting;;;;;NONE;
  47;Wie teuer ist das Benzin;;;;;NONE;
  48;Ruf Mama an;;;;;NONE;
  49;5550985 anrufen;;;;;NONE;
  50;Ich habe ein Taxi bestellt, bestell es ab;Anzahl;ein;8;11;CANCEL;
  51;Taxi am 8. abbestellen;datetimeV2;am 8.;4;9;CANCEL;
  52;Bestell das Taxi fuer morgen zu meiner Freundin ab;datetimeV2;morgen;21;27;CANCEL;
  53;Bestell das Taxi fuer morgen zu meiner Freundin ab;vonOrt;zu meiner Freundin;28;46;CANCEL;
  54;Bestell die beiden Taxen nach Dresden ab;Anzahl;beiden;11;17;CANCEL;
  55;Bestell die beiden Taxen nach Dresden ab;zuOrt;nach Dresden;24;36;CANCEL;
  56;Was kostet ein Taxi, wenn ich es nicht nehme;Anzahl;ein;10;13;NONE;
  57;Was kostet es, sich in ein Taxi zu setzen;Anzahl;ein;22;25;PRICE;
  58;Ich will nach Hause;zuOrt;nach Hause;8;18;NONE;
  59;Taxi um 3 weg;datetimeV2;um 3;4;8;CANCEL;
  60;Taxi!;;;;;BOOK;
  61;Ich brauche morgen doch nur ein Taxi;Anzahl;ein;27;30;CHANGE;
  62;Ich brauche morgen doch nur ein Taxi;datetimeV2;morgen;11;17;CHANGE;
  63;Ich habe am 5. zwei Taxen bestellt, brauche aber drei;datetimeV2;5.;11;13;CHANGE;
  64;Ich habe am 5. zwei Taxen bestellt, brauche aber drei;Anzahl;zwei;14;18;CHANGE;
  65;Ich habe am 5. zwei Taxen bestellt, brauche aber drei;Anzahl;drei;48;52;CHANGE;
  66;Taxi umbuchen, nicht von zu Hause sondern vom Bahnhof;vonOrt;zu Hause;24;32;CHANGE;
  67;Taxi umbuchen, nicht von zu Hause sondern vom Bahnhof;vonOrt;Bahnhof;45;52;CHANGE;
  68;Ich brauche das Taxi zwei Stunden frueher;datetimeV2;zwei Stunden frueher;20;40;CHANGE;`;

}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length 
//  && a.every((val, index) => val === b[index]); // '#' != 'number' => error
}