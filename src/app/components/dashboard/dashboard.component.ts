import { Component, OnInit } from '@angular/core';
import { LuisApp, DUMMY_APPS } from 'src/app/models/LuisApp';
import { PersistentService } from 'src/app/services/persistent.service';
import { NotificationService, NotificationType, Notification } from 'src/app/services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  gridViewIsActive: boolean = true;

  apps: Array<LuisApp> = [];

  constructor(private persistentService: PersistentService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadApps();
  }

  loadApps() {
    this.apps = [];
    this.persistentService.getApps().subscribe(k => {
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
