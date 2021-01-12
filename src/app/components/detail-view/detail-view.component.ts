import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LuisApp } from '../../models/LuisApp';
import { DUMMY_APPS } from '../../models/LuisApp';
import { LuisAppService } from '../../services/luis-app.service';
import { NotificationType, Notification, NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/runtime-environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {

  luisApp: LuisApp = null;
  deleteModal: boolean = false;

  constructor(private location: Location, private route: ActivatedRoute, private luisAppService: LuisAppService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (environment.production) {
      this.getApp();
    } else {
      this.luisApp = DUMMY_APPS[0];
    }
  }

  getApp(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.luisAppService.getApps().subscribe(k => {
      this.luisApp = k.filter((app: LuisApp) => app.name === name);
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
