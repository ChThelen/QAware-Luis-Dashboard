import { Component, OnInit, ViewChild } from '@angular/core';
import { Utterance, HEADERS } from 'src/app/models/Utterance';
import { NotificationType, Notification, NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-csv-reader',
  templateUrl: './csv-reader.component.html',
  styleUrls: ['./csv-reader.component.scss']
})
export class CsvReaderComponent implements OnInit {
  @ViewChild('csvReader') csvReader: any;

  file: File = null;
  selectedUtterance: Utterance = null;
  result: Utterance[] = [];
  delimiter: string = ';';

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  readCsvFile(event: any) {

    let fileList: FileList = event.target.files;
    this.file = fileList.item(0);

    if (!(this.file.name.endsWith(".csv"))) {
      this.file = null;
      console.log('Error occured while reading file. Please import valid .csv file!');
    }

    let fileReader = new FileReader();
    fileReader.readAsText(this.file);

    fileReader.onload = () => {
      let data = fileReader.result;
      let dataArray: string[] = (<string>data).split(/\r\n|\n/);

      let headers = dataArray[0].split(this.delimiter);
      /* For usage with no id in header
      let headersWithoutId = headers.slice(1, headers.length);
      */
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

    fileReader.onerror = () => {
      console.log('Error occured while reading file!');
      this.resetFile();
    };

  }

  resetFile() {
    this.csvReader.nativeElement.value = "";
    this.file = null;
    this.result = [];
  }

  editUtterance(utterance: Utterance){
    utterance = Object.assign(this.selectedUtterance);
    this.selectedUtterance = null;
  }

  deleteUtterance(utterance: Utterance){
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
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}