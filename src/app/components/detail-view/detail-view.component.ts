import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LuisApp } from '../../models/LuisApp';
import { DUMMY_APPS } from '../../models/LuisApp';
import { LuisAppService } from '../../services/luis-app.service';
import { NotificationType, Notification, NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/runtime-environment';
import { Location} from '@angular/common';
import { LuisAppStats } from 'src/app/models/LuisAppStats';
import { ChartDataSets } from 'chart.js';
import { ClrWizard } from '@clr/angular';
import { Intent } from 'src/app/models/Intent';
import { Entity } from 'src/app/models/Entity';
import { Utterance } from 'src/app/models/Utterance';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {
  @ViewChild("wizard") wizard: ClrWizard;

  luisApp: LuisApp = null;
  luisAppStats: LuisAppStats[] = null;
  luisAppHits: number = -1;
  deleteModal: boolean = false;
  jsonModal: boolean = false;
  editWizard: boolean = false;

  wizardModel: any = {};
  editOption: string = null;

  chartLabels: string[];
  chartData:  ChartDataSets[];

  constructor(private location: Location, private route: ActivatedRoute, private luisAppService: LuisAppService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (environment.production) {
      this.getApp();
      this.getAppStats();
      this.getAppHits();
    } else {
      this.luisApp = DUMMY_APPS[0];
    }
  }

  openEditWizard(): void{
    this.wizardModel = {};
    this.editWizard = true;
  }

  closeEditWizard(): void{
    this.wizardModel = {};
    this.wizard.reset();
    this.editOption = null;
    this.editWizard = false;
  }

  getApp(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.luisAppService.getApps().subscribe(k => {
      this.luisApp = k.filter((app: LuisApp) => app.name === name)[0];
      this.getAppJSON();
    });
  }

  getAppJSON(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.luisAppService.getAppJSON(name).subscribe(k =>{
      this.luisApp.appJson = k;
    });
  }

  getAppHits(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.luisAppService.getHitCount(name).subscribe(k =>{
      this.luisAppHits = k;
    })
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
        this.showNotification("Failed while deleting App!", null);
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
