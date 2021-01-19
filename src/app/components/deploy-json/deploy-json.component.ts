import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HEADERS, Utterance } from 'src/app/models/Utterance';
import { LuisAppService } from 'src/app/services/luis-app.service';

@Component({
  selector: 'app-deploy-json',
  templateUrl: './deploy-json.component.html',
  styleUrls: ['./deploy-json.component.scss']
})
export class DeployJsonComponent implements OnInit 
{
  @Input() 
  jsonString:string;

  @Output()
  jsonStringChange = new EventEmitter<string>();

  
  intents: string[] = [];
  intentsSelection: boolean[] = [];
  selectedUtterances:Utterance[] = []
  result: Utterance[] = [];
 
  timelineStyle = {
    step0:{state:"current",open:true},
    step1:{state:"not-started",open:false},
    step2:{state:"not-started",open:false},
    step3:{state:"not-started",open:false},
    step4:{state:"not-started",open:false},
  }; 
  luis = {
    app: 
    {
      name: '',
      description: '',
      id: '',
      version:'',
      created:1,
      trained: 1,
      published:1,
      staging : true,
      production : false
    }
  };
  closeStep()
  {
    this.timelineStyle = {
      step0:{state:"current",open:false},
      step1:{state:"not-started",open:false},
      step2:{state:"not-started",open:false},
      step3:{state:"not-started",open:false},
      step4:{state:"not-started",open:false},
    }; 
  }
  constructor(private luisService:LuisAppService)
  {
    this.createUtterances(this.groundTruth,this.result);
    this.intents = this.getIntents();
  }

  ngOnInit(): void 
  {
    
  }
  createUtterances(file:string,result:Utterance[]) : void
  {
    
    let dataArray: string[] = file.split(/\r\n|\n/);
    let headers = dataArray[0].split(";");
   
      let i = 1;
      for ( i = 1; i < dataArray.length; i++) {
        let currentLine = dataArray[i].split(";");
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
  selectionChanged(event:any)
  {
   
  
      
    
  }
  createApp()
  {
    this.luisService.createApp(this.jsonString).subscribe(data=>{this.luis.app.id=data; console.log(data)});
    this.luis.app.created = 0;
    if(this.luis.app.id.length > 5 || this.luis.app.created == 0) // App has been created
    {
      this.manageTimeLineStyle();
      
    }
    else // App isn't created or already existing
    {
        //TODO : User must be notify 
    }
  }
  train()
  {
    this.luisService.train(this.jsonString).subscribe(data=>{this.luis.app.trained=data});
    this.luis.app.trained = 0;
    if(this.luis.app.trained == 0) // App is trained
    {
      this.manageTimeLineStyle();
    }
    else // App isn't trained
    {
    
        //TODO : User must be notify 
    }
  }
  publish()
  {
    this.luisService.publish(this.jsonString,this.luis.app.staging).subscribe(data=>{this.luis.app.published=data});
    this.luis.app.published = 0;
    if(this.luis.app.published == 0) // App is published
    {
      this.manageTimeLineStyle();
    }
    else // App isn't published
    {
        //TODO : User must be notify 
    }
  }
  
  manageTimeLineStyle()
  {
    if(this.luis.app.created == 0 && this.luis.app.trained == 1 && this.luis.app.published == 1)
    {
      this.timelineStyle.step1.state = "success";
      this.timelineStyle.step2.state = "current";
    }
    else if(this.luis.app.trained == 0 && this.luis.app.published == 1)
    {
      this.timelineStyle.step2.state = "success";
      this.timelineStyle.step3.state = "current";
    }
    if(this.luis.app.published == 0)
    {
      this.timelineStyle.step3.state = "success";
      this.timelineStyle.step4.state = "current";
    }
  }
  editNameAndDescription(name:string,description:string)
  {
    
   if(this.luis.app.name.trim()!="")
    {
      let startIndex = this.jsonString.split(/\r\n|\n/).join("").lastIndexOf('\"name\"');
      let endIndex = this.jsonString.split(/\r\n|\n/).join("").indexOf(",",startIndex)+1;
      let oldName = this.jsonString.split(/\r\n|\n/).join("").substring(startIndex,endIndex);
      let newName = '\"name\":'+' \"'+ name.trim() +"\",";
      this.jsonString = this.jsonString.replace(oldName,newName);
    }
    if(this.luis.app.description.trim()!="")
    {
      let startIndex = this.jsonString.split(/\r\n|\n/).join("").lastIndexOf('\"desc\"');
      let endIndex = this.jsonString.split(/\r\n|\n/).join("").indexOf(",",startIndex)+1;
      let oldDesc = this.jsonString.split(/\r\n|\n/).join("").substring(startIndex,endIndex);
      let newDesc = '\"desc\":'+' \"'+ description.trim() +"\",";
      this.jsonString = this.jsonString.replace(oldDesc,newDesc);
    }
  }
  jsonStringValueChanged()
  {
    this.jsonStringChange.emit(this.jsonString);
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
