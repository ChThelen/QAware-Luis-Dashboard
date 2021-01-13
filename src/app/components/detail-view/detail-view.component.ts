import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LuisApp } from '../../models/LuisApp';
import { DUMMY_APPS } from '../../models/LuisApp';
import { LuisAppService } from '../../services/luis-app.service';
import { NotificationType, Notification, NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/runtime-environment';
import { Location} from '@angular/common';
import { LuisAppStats } from 'src/app/models/LuisAppStats';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {
  
  luisApp: LuisApp = null;
  luisAppStats: LuisAppStats[] = null;
  deleteModal: boolean = false;
  jsonModal: boolean = false;

  chartLabels: string[];
  chartData:  ChartDataSets[];
  chartLegend = false;
  chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  chartColors: Color[] = [
    {
      backgroundColor: 'rgba(0,54,77,0.28)',
    },
  ];
  constructor(private location: Location, private route: ActivatedRoute, private luisAppService: LuisAppService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (environment.production) {
      this.getApp();
      this.getAppStats();
    } else {
      this.luisApp = DUMMY_APPS[0];
    }
  }

  getApp(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.luisAppService.getApps().subscribe(k => {
      this.luisApp = k.filter((app: LuisApp) => app.name === name)[0];
      // REMOVE DUMMY JSON LATER
      const dummyJson = { "intents": [{ "name": "TAXI__BOOK" }, { "name": "TAXI__PRICE" }, { "name": "TAXI__TIME" }, { "name": "TAXI__CANCEL" }], "entities": [{ "name": "location", "roles": [], "children": [{ "name": "from", "children": [] }, { "name": "over", "children": [] }, { "name": "destination", "children": [] }] }, { "name": "count", "roles": [] }], "composites": [], "closedLists": [], "regex_entities": [], "regex_features": [], "utterances": [{ "text": "Buch mir ein Taxi von M\u00fcnchen nach Berlin", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 9, "endPos": 11 }, { "entity": "location", "startPos": 22, "endPos": 28, "children": [{ "entity": "from", "startPos": 22, "endPos": 28 }] }, { "entity": "location", "startPos": 35, "endPos": 40, "children": [{ "entity": "destination", "startPos": 35, "endPos": 40 }] }] }, { "text": "Ich brauche um 14 Uhr ein Taxi zuhause.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 22, "endPos": 24 }, { "entity": "location", "startPos": 31, "endPos": 37, "children": [{ "entity": "from", "startPos": 31, "endPos": 37 }] }] }, { "text": "Ruf mir ein Taxi.", "intent": "TAXI__BOOK", "entities": [] }, { "text": "Bestell mir ein Taxi f\u00fcr Freitag 16Uhr.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 12, "endPos": 14 }] }, { "text": "Bestell mir ein Taxi f\u00fcr den 20.11.2020 14 Uhr.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 12, "endPos": 14 }] }, { "text": "Hol mir ein Taxi nach Mainz.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 8, "endPos": 10 }, { "entity": "location", "startPos": 22, "endPos": 26, "children": [{ "entity": "destination", "startPos": 22, "endPos": 26 }] }] }, { "text": "Hol mir zwei Taxen um 22 Uhr.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 8, "endPos": 11 }] }, { "text": "Hol mir ein Taxi nach Essen und zur\u00fcck.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 8, "endPos": 10 }, { "entity": "location", "startPos": 22, "endPos": 26, "children": [{ "entity": "over", "startPos": 22, "endPos": 26 }] }, { "entity": "location", "startPos": 32, "endPos": 37, "children": [{ "entity": "destination", "startPos": 32, "endPos": 37 }] }] }, { "text": "Ruf mir ein Taxi zum Essen.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 8, "endPos": 10 }] }, { "text": "Ruf mir ein Taxi von Wiesbaden \u00fcber Frankfurt nach Dresden.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 8, "endPos": 10 }, { "entity": "location", "startPos": 21, "endPos": 29, "children": [{ "entity": "from", "startPos": 21, "endPos": 29 }] }, { "entity": "location", "startPos": 36, "endPos": 44, "children": [{ "entity": "over", "startPos": 36, "endPos": 44 }] }, { "entity": "location", "startPos": 51, "endPos": 57, "children": [{ "entity": "destination", "startPos": 51, "endPos": 57 }] }] }, { "text": "Bestell mir ein Taxi f\u00fcr morgen zu meinerFreundin.", "intent": "TAXI__BOOK", "entities": [{ "entity": "count", "startPos": 12, "endPos": 14 }, { "entity": "location", "startPos": 35, "endPos": 48, "children": [{ "entity": "from", "startPos": 35, "endPos": 48 }] }] }, { "text": "Taxi, 12Uhr", "intent": "TAXI__BOOK", "entities": [] }, { "text": "Was kostet ein Taxi von Mainz nach Bingen.", "intent": "TAXI__PRICE", "entities": [{ "entity": "count", "startPos": 11, "endPos": 13 }, { "entity": "location", "startPos": 24, "endPos": 28, "children": [{ "entity": "from", "startPos": 24, "endPos": 28 }] }, { "entity": "location", "startPos": 35, "endPos": 40, "children": [{ "entity": "destination", "startPos": 35, "endPos": 40 }] }] }, { "text": "Wann ist ein Taxi in Bingen.", "intent": "TAXI__TIME", "entities": [{ "entity": "count", "startPos": 9, "endPos": 11 }, { "entity": "location", "startPos": 21, "endPos": 26, "children": [{ "entity": "destination", "startPos": 21, "endPos": 26 }] }] }, { "text": "Wie lange dauert es mit dem Taxi von Ingelheim nach Wiesbaden.", "intent": "TAXI__TIME", "entities": [{ "entity": "location", "startPos": 37, "endPos": 45, "children": [{ "entity": "from", "startPos": 37, "endPos": 45 }] }, { "entity": "location", "startPos": 52, "endPos": 60, "children": [{ "entity": "destination", "startPos": 52, "endPos": 60 }] }] }, { "text": "Wann kann das n\u00e4chste Taxi bei mir sein.", "intent": "TAXI__TIME", "entities": [{ "entity": "location", "startPos": 27, "endPos": 33, "children": [{ "entity": "destination", "startPos": 27, "endPos": 33 }] }] }, { "text": "Ich brauche kein Taxi mehr.", "intent": "TAXI__CANCEL", "entities": [] }, { "text": "Storniere das Taxi am Freitag f\u00fcr 16Uhr.", "intent": "TAXI__CANCEL", "entities": [] }, { "text": "Bestell mein Taxi f\u00fcr den 20. November ab.", "intent": "TAXI__CANCEL", "entities": [] }, { "text": "Bestell mein Taxi ab.", "intent": "TAXI__CANCEL", "entities": [] }], "patterns": [], "patternAnyEntities": [], "prebuiltEntities": [{ "name": "datetimeV2", "roles": [] }], "luis_schema_version": "7.0.0", "versionId": "0.1", "name": "", "desc": "", "culture": "en-us", "phraselists": [] };
      this.luisApp.appJson = this.luisApp.appJson == null ? dummyJson : this.luisApp.appJson;
      
    });
  }

  getAppStats(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.luisAppService.getAppStats(name).subscribe(k => {
      this.luisAppStats = k;
      this.chartData = new Array();
      this.chartData.push({data: k.map((appStat: LuisAppStats) => appStat.average), label: name});
      this.chartLabels = k.map((appStat: LuisAppStats) => appStat.version);
    });
  }

  deleteApp() {
    this.luisAppService.deleteApp(this.luisApp.name).subscribe(result => {
      this.luisApp = null;
      this.deleteModal = false;
      this.location.back();
    },
      err => {
        //TO:DO Display Notfication
      }
    )
  }

  donwloadJsonFile() :void
  {
      var hiddenElement = document.createElement('a');
      hiddenElement.setAttribute('type', 'hidden');
      hiddenElement.href = 'data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(this.luisApp.appJson, null, "\t"));
      hiddenElement.target = '_blank';
      hiddenElement.download = `${this.luisApp.name}.json`;
      hiddenElement.click();
      hiddenElement.remove();
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
