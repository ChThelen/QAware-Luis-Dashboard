import { Component, Input, OnInit } from '@angular/core';
import { LuisApp } from 'src/app/models/LuisApp';
import { NotificationType, Notification, NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss']
})
export class TilesComponent implements OnInit {

  @Input()
  apps: Array<LuisApp> = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
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
