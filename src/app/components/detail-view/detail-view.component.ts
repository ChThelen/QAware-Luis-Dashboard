import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
import { ClrWizard } from '@clr/angular';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {
  @ViewChild("editWizard") wizard: ClrWizard;

  luisApp: LuisApp = null;
  luisAppStats: LuisAppStats[] = null;
  deleteModal: boolean = false;
  jsonModal: boolean = false;
  editWizard: boolean = false;

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
      this.getAppJSON();
    });
  }

  getAppJSON(): void{
    const name = this.route.snapshot.paramMap.get('name');
    this.luisAppService.getAppJSON(name).subscribe(k =>{
      this.luisApp.appJson = k;
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
