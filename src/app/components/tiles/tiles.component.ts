import { Component, OnInit } from '@angular/core';
import { LuisApp } from 'src/app/models/LuisApp';
import { DUMMY_APPS } from 'src/app/models/LuisApp';
import { LuisAppService } from 'src/app/services/luis-app.service';
import { NotificationType, Notification, NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/runtime-environment';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss']
})
export class TilesComponent implements OnInit {

  apps: Array<LuisApp> = [];

  constructor(private luisAppService: LuisAppService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    if(environment.production){
      this.loadApps();
    } else{
      this.apps = DUMMY_APPS;
    }
  }

  loadApps() {
    this.apps = [];
    this.luisAppService.getApps().subscribe(k => {
      this.apps = k;
    });
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
