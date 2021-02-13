import { Component, OnInit, ViewChild } from '@angular/core';
import { CsvUtterance, HEADERS } from 'src/app/models/CsvUtterance';
import { LuisAppService } from 'src/app/services/luis-app.service';
import { PersistentService } from 'src/app/services/persistent.service';
import { ConvertService } from 'src/app/services/convert.service';
import { NotificationType, Notification, NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-ground-truth',
  templateUrl: './ground-truth.component.html',
  styleUrls: ['./ground-truth.component.scss']
})
export class GroundTruthComponent implements OnInit {

  @ViewChild('csvReader') csvReader: any;

  // Uploaded file Properties
  file: File = null;
  fileName = "";
  uploadedFile: string = "";
  uploadedUtterances: CsvUtterance[] = [];
  // GT properties
  selectedUtterances: CsvUtterance[] = [];
  result: CsvUtterance[] = []; // Array of all Utterances
  delimiter: string = ';';
  intents: string[] = [];
  intentsSelection: boolean[] = [];
  groundTruth: string = "";


  modalOpenedforNewLine = false;
  newLine: CsvUtterance = new CsvUtterance();
  newChange: boolean = false;
  confirmSave: boolean = false;
  disabledConfirm: boolean = false;
 
  

  constructor(
    private persistentService: PersistentService,
    private notificationService: NotificationService
    ) {}

  ngOnInit(): void {
    this.getGT();
  }
/**
 * Load GT data
 */
  getGT() {
    this.result = [];
    this.persistentService.getGT().subscribe(
      data => {
        this.groundTruth = data;
        this.createUtterances(this.groundTruth, this.result);
        this.intents = this.getIntents();
    }, 
    err => {
      this.showNotification("Error while reading Ground Truth records. Please contact an administrator or see details for more information.", err.message);

    });
    this.newChange = false;
  }
  /** select special intents via intents buttons*/
  selectIntents(intent: string) {
    this.result.forEach(element => { if (element.intent == intent) { this.selectedUtterances.push(element) } });
  }
/** deselect special intents via intents buttons*/
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
/**
 * create Table for GT
 * @param file 
 * @param result 
 */
  createUtterances(file: string, result: CsvUtterance[]): void {

    if (result.length != 0)
      result = [];
    let dataArray: string[] = file.split(/\r\n|\n/);
    let headers = dataArray[0].split(this.delimiter);
    
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
   
  }
/**
 * To Read a uploaded csv File
 * @param event 
 */
  readCsvFile(event: any) {

    let fileList: FileList = event.target.files;
    this.file = fileList.item(0);
    this.fileName = fileList.item(0).name;

 
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
/**
 * Add new records to the GT via a uploaded file
 */
  merge() {
    this.persistentService.merge(this.uploadedFile).subscribe(data => {
      this.groundTruth = data; 
      this.createUtterances(this.groundTruth, this.result); 
      this.resetFile();
      this.showNotification(`New records have been successfully added.`, '');
    }, 
    err => {
      this.showNotification("Error while adding new records. Please contact an administrator or see details for more information.", err.message);

    });
  }
  /**
   * Method to save every Changes on the GT Table 
   */
  saveChanges() {
    this.groundTruth = this.refreshUtterances(this.result).join("\n");
    if (this.newChange) {
      this.persistentService.changeGT(this.groundTruth).subscribe(data => 
        {
          this.groundTruth = data; 
          console.log(data)
          this.createUtterances(this.groundTruth, this.result);
          this.showNotification(`Ground Truth has been successfully changed.`, '');
        }, 
        err => {
          this.showNotification("Error while saving Ground Truth. Please contact an administrator or see details for more information.", err.message);
    
        });
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
/**
 * Delete Many selected Utterances from the GT
 * @param csvUtterance array of Utterances that will be deleted
 */
  deleteUtterances(csvUtterance: CsvUtterance[]): void {
    this.result = this.result.filter(element => !(csvUtterance.includes(element)));
    this.newChange = true;
    this.intents = this.getIntents();
  }
/**
 * 
 * @param csvUtterance 
 */
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
    hiddenElement.download = fileName + ".csv";
    hiddenElement.click();
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
      entriesArray.push(entries.join(this.delimiter).replace(/-/gi, ""));
    }
    entriesArray.unshift(HEADERS.join(this.delimiter));

    return entriesArray;
  }
  /**
   * @returns the first index of literal in transcript by adding new Line
   * @param literal 
   * @param transcript 
   */
  getFirstIndexOf(literal: string, transcript: string): string {
    let firstIndex = -1;
    if (literal != "" && transcript != "") {
      firstIndex = transcript.trim().indexOf(literal.trim());
    }
    this.newLine.startIndex = firstIndex == -1 ? "" : "" + firstIndex;
    return firstIndex == -1 ? "" : "" + firstIndex;
  }
/**
   * @returns the last index of literal in transcript by adding new Line
   * @param literal 
   * @param transcript 
   */
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
/**
 * 
 */
  cancelInsert() {
    this.newLine = new CsvUtterance();
  }
  /**
   * editablecell component changes are recovered through this method
   * @param change 
   */
  newChanges(change: boolean) {
    this.newChange = change;
  }

  showNotification(message: string, messageDetails: string) {
    this.notificationService.add(
      new Notification(
        NotificationType.Info,
        message,
        messageDetails
      )
    )
  }

}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length
   // && a.every((val, index) => val === b[index]); // '#' != 'number' => error
}