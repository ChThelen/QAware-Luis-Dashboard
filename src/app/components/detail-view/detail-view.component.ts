import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LuisApp } from '../../models/LuisApp';
import { LuisAppService } from '../../services/luis-app.service';
import { NotificationType, Notification, NotificationService } from 'src/app/services/notification.service';
import { Location } from '@angular/common';
import { LuisAppStats } from 'src/app/models/LuisAppStats';
import { ChartDataSets } from 'chart.js';
import { ClrWizard } from '@clr/angular';
import { Intent } from 'src/app/models/Intent';
import { Entity } from 'src/app/models/Entity';
import { Utterance } from 'src/app/models/Utterance';
import { Color } from 'ng2-charts';
import { PersistentService } from '../../services/persistent.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {
  @ViewChild("editWizard") editWizard: ClrWizard;

  //App Data
  luisApp: LuisApp = null;
  luisAppStats: LuisAppStats[] = null;
  luisAppHits: number = 0;

  //App Delete Modal
  deleteModal: boolean = false;

  //App JSON Modal
  jsonModal: boolean = false;

  //Edit Wizard
  editWizard_opened: boolean = false;
  editWizard_option: string = null;
  editWizard_selectedUtterances: Utterance[] = [];
  editWizard_utterances: Utterance[];
  editWizard_utterance: Utterance;
  editWizard_intent: Intent;
  editWizard_entity: Entity;

  //Chart Data
  dummyChartType = 'line';
  dummyChartData = {
    labels: ['v0.1', 'v0.1', 'v0.2', 'v0.2', 'v0.3', 'v0.3', 'v0.4'],
    datasets: [{
      label: 'TAXI_BOOK',
      data: [0, 4, 5, 21, 3, 30, 15]
    },
    {
      label: 'TAXI_CANCEL',
      data: [2, 6, 6, 12, 6, 20, 35]
    },
    {
      label: 'TAXI_PRICE',
      data: [4, 8, 7, 21, 9, 30, 22]
    },
    {
      label: 'TAXI_TIME',
      data: [6, 10, 8, 12, 12, 20, 45]
    }],
  }
  dummyChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  }

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private luisAppService: LuisAppService,
    private persistentService: PersistentService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getApp();
    this.getAppStats();
    this.getAppHits();
  }

  getApp(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.persistentService.getApp(name).then(luisApp => {
      this.luisApp = luisApp;
      this.getAppJSON();
    })
  }

  getAppJSON(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.persistentService.getAppJSON(name).subscribe(k => {
      this.luisApp.appJson = k;
    });
  }

  getAppHits(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.luisAppService.getHitCount(name).subscribe(k => {
      this.luisAppHits = k;
    })
  }

  getAppStats(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.persistentService.getAppStats(name).subscribe(k => {
      this.luisAppStats = k;
    });
  }

  deleteApp(): void {
    this.luisAppService.deleteApp(this.luisApp.name).subscribe(response => {
      this.luisApp = null;
      this.deleteModal = false;
      this.location.back();
    },
      err => {
        this.showNotification("Failed while deleting App!", err, NotificationType.Danger);
      }
    );
  }

  publishApp(): void {
    const name = this.route.snapshot.paramMap.get('name');

    this.luisAppService.publish(name, false).subscribe(response => {
      window.location.reload();
    },
      err => {
        this.showNotification("Failed while publishing App!", err, NotificationType.Danger);
      }
    );
  }

  addUterance(): void {
    if (this.editWizard_utterance.text && this.editWizard_utterance.intentName) {
      this.editWizard_utterances.push(this.editWizard_utterance);
      this.editWizard_utterance = new Utterance();
    }
  }

  removeUtterance(): void {
    this.editWizard_selectedUtterances.forEach(selectedUtterance => {
      this.editWizard_utterances = this.editWizard_utterances.filter(utterance => utterance !== selectedUtterance);
    })
  }

  trainApp(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.luisAppService.trainApp(name).subscribe(result => {
      if ((<number>result.body) === 0) {
        this.showNotification("Training was successfully. Please reload page!", null, NotificationType.Info);
        window.location.reload();
      }
    },
      err => {
        this.showNotification("Failed while testing App!", null, NotificationType.Danger);
      }
    );
  }

  donwloadJsonFile(): void {
    var hiddenElement = document.createElement('a');
    hiddenElement.setAttribute('type', 'hidden');
    hiddenElement.href = 'data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(this.luisApp.appJson, null, "\t"));
    hiddenElement.target = '_blank';
    hiddenElement.download = `${this.luisApp.name}.json`;
    hiddenElement.click();
    hiddenElement.remove();
  }

  showNotification(message: string, messageDetails: string, type: NotificationType) {
    this.notificationService.add(
      new Notification(
        type,
        message,
        messageDetails
      )
    )
  }

  openEditWizard(): void {
    this.editWizard_intent = new Intent();
    this.editWizard_entity = new Entity();
    this.editWizard_utterance = new Utterance();
    this.editWizard_utterances = [];
    this.editWizard_opened = true;
  }

  closeEditWizard(): void {
    this.editWizard.reset();
    this.editWizard_option = null;
    this.editWizard_opened = false;
  }

  finishEditWizard(): void {

    const name = this.route.snapshot.paramMap.get('name');

    switch (this.editWizard_option) {
      case "intent": {
        this.luisAppService.addIntent(name, this.editWizard_intent).subscribe(k => {
          this.showNotification("Intent added successfully. Please reload page!", null, NotificationType.Info);
        });
        break;
      }
      case "entity": {
        this.luisAppService.addEntity(name, this.editWizard_entity).subscribe(k => {
          this.showNotification("Entity added successfully. Please reload page!", null, NotificationType.Info);
        });
        break;
      }
      case "utterances": {
        this.luisAppService.addUtterances(name, this.editWizard_utterances).subscribe(k => {
          this.showNotification("Utterances added successfully. Please reload page!", null, NotificationType.Info);
        });
        break;
      }
      case "json": {
        break;
      }
      default: {
        break;
      }
    }

    this.closeEditWizard();
  }

}
