import { Component, OnInit, ViewChild } from '@angular/core';
import { CsvUtterance, HEADERS } from 'src/app/models/CsvUtterance';
import { LuisAppService } from 'src/app/services/luis-app.service';
import { ClrLoadingState } from '@clr/angular';
import { PersistentService } from 'src/app/services/persistent.service';
import { ConvertService } from 'src/app/services/convert.service';

@Component({
  selector: 'app-ground-truth',
  templateUrl: './ground-truth.component.html',
  styleUrls: ['./ground-truth.component.scss']
})
export class GroundTruthComponent implements OnInit {

  @ViewChild('csvReader') csvReader: any;

  file: File = null;
  fileName = "";
  uploadedFile: string = "";
  selectedUtterances: CsvUtterance[] = []
  result: CsvUtterance[] = [];
  uploadedUtterances: CsvUtterance[] = [];
  delimiter: string = ';';
  modalOpenedforNewLine = false;
  newLine: CsvUtterance = new CsvUtterance();
  newChange: boolean = false;
  confirmSave: boolean = false;
  disabledConfirm: boolean = false;
  intents: string[] = [];
  intentsSelection: boolean[] = [];

  groundTruth: string = ""

  constructor(
    private luisService: LuisAppService,
    private persistentService: PersistentService,
    private convertService: ConvertService) { }

  ngOnInit(): void {
    this.getGT();
  }

  getGT() {
    this.result = [];
    this.persistentService.getGT().subscribe(data => {
      this.groundTruth = data;
      this.createUtterances(this.groundTruth, this.result);
      this.intents = this.getIntents();
    });
    this.newChange = false;
  }

  selectIntents(intent: string) {
    this.result.forEach(element => { if (element.intent == intent) { this.selectedUtterances.push(element) } });
  }

  deselectIntents(intent: string) {
    this.selectedUtterances = this.selectedUtterances.filter(element => element.intent != intent);
  }

  getIntents(): string[] {
    if (this.intentsSelection.length != 0)
      this.intentsSelection = [];
    let temp = this.result.map(element => element.intent);
    temp = [...new Set(temp)];
    temp.forEach(element => this.intentsSelection.push(false));
    return temp;
  }

  createUtterances(file: string, result: CsvUtterance[]): void {

    if (result.length != 0)
      result = [];
    let dataArray: string[] = file.split(/\r\n|\n/);
    let headers = dataArray[0].split(this.delimiter);
    if (arrayEquals(headers, HEADERS)) {
      let i = 1;
      for (i = 1; i < dataArray.length; i++) {
        let currentLine = dataArray[i].split(this.delimiter);
        if (currentLine.length == headers.length) {
          let csvUtterance: CsvUtterance = new CsvUtterance();
          csvUtterance.id = i + "";
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
    } else {
      console.log('Error occured while reading file. Found different Headers!');
      this.resetFile();
    }
  }

  readCsvFile(event: any) {

    let fileList: FileList = event.target.files;
    this.file = fileList.item(0);
    this.fileName = fileList.item(0).name;

    if (!((this.file.name.endsWith(".csv")) || (this.file.name.endsWith('.json')))) {
      this.file = null;
      console.log('Error occured while reading file. Please import valid .csv or .json file!');
    }
    else {
      let fileReader = new FileReader();
      fileReader.readAsText(this.file);
      if ((this.file.name.endsWith(".csv"))) // Reading csv file
      {
        fileReader.onload = () => {
          let data = fileReader.result;
          this.uploadedFile = (<string>data);
          this.createUtterances(this.uploadedFile, this.uploadedUtterances);
        }
        fileReader.onerror = () => {
          console.log('Error occured while reading file!');
          this.resetFile();
        };
      }

    }
  }

  merge() {
    let csvArray1 = this.uploadedFile.split(/\r\n|\n/); 
    let csvArray2 = this.groundTruth.split(/\r\n|\n/); 
    csvArray1.shift();
   
    this.persistentService.merge(this.uploadedFile).subscribe(data => {console.log(data)})
    this.getGT();
   // console.log(this.groundTruth)
  }

  saveChanges() {
    if (this.newChange) {
      this.persistentService.changeGT(this.groundTruth).subscribe(data => console.log(data));
      this.persistentService.getGT().subscribe(data => { this.groundTruth = data; this.createUtterances(this.groundTruth, this.result); });
    }

    this.newChange = false;

  }

  resetFile() {

    this.file = null;
    this.uploadedFile = "";
    this.uploadedUtterances = [];
    this.fileName = "";
  }

  selectionChanged(event: any) {

    if (this.selectedUtterances.length == 0) {
      this.intents.forEach(element => this.intentsSelection.push(false));
    }


  }

  deleteUtterance(csvUtterance: CsvUtterance): void {
    let j = this.uploadedUtterances.indexOf(csvUtterance);
    if (j > -1) {
      this.uploadedUtterances.splice(j, 1);
      this.intents = this.getIntents();
    }
  }

  deleteUtterances(csvUtterance: CsvUtterance[]): void {
    this.result = this.result.filter(element => !(csvUtterance.includes(element)));
    this.newChange = true;
    this.intents = this.getIntents();
  }

  insertUtterance(csvUtterance: CsvUtterance): void {
    this.result.push(csvUtterance);
    this.result.sort((a, b) => { return (parseInt(a.id) < parseInt(b.id)) ? -1 : 1 })
    this.intents = this.getIntents();
    this.newLine = new CsvUtterance();
    this.newChange = true;
  }

  /**
  * download currently csv file
  * 
  */
  downloadCsv(): void {
    let fileName = "MyCsvFile" + new Date().toDateString();
    let content = this.refreshUtterances(this.selectedUtterances).join("\n");
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(content);
    hiddenElement.target = '_blank';
    hiddenElement.download = (fileName.endsWith(".csv")) ? fileName.substring(0, fileName.length - 3) + "csv" : fileName.substring(0, fileName.length - 4) + "csv";
    hiddenElement.click();
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
      entriesArray.push(entries.join(this.delimiter).replace(/-/gi, ""));
    }
    entriesArray.unshift(HEADERS.join(this.delimiter));

    return entriesArray;
  }

  getFirstIndexOf(literal: string, transcript: string): string {
    let firstIndex = -1;
    if (literal != "" && transcript != "") {
      firstIndex = transcript.trim().indexOf(literal.trim());
    }
    this.newLine.startIndex = firstIndex == -1 ? "" : "" + firstIndex;
    return firstIndex == -1 ? "" : "" + firstIndex;
  }

  getLastIndexOf(literal: string, transcript: string): string {
    if (this.getFirstIndexOf(literal.trim(), transcript) != "") {
      let firstIndex = transcript.trim().indexOf(literal.trim());
      let lastIndex = firstIndex + literal.length;
      this.newLine.endIndex = lastIndex + "";
      return lastIndex + "";
    }
    else {
      this.newLine.endIndex = "";
      return "";
    }
  }

  cancelInsert() {
    this.newLine = new CsvUtterance();
  }

  newChanges(change: boolean) {
    this.newChange = change;
    console.log(change);
  }

}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length
  //  && a.every((val, index) => val === b[index]); // '#' != 'number' => error
}