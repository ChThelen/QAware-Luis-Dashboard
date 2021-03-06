import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { LuisApp } from 'src/app/models/LuisApp';
import { LuisAppService } from 'src/app/services/luis-app.service';
import { NotificationType, Notification, NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-manage-view',
  templateUrl: './manage-view.component.html',
  styleUrls: ['./manage-view.component.scss']
})
export class ManageViewComponent implements OnInit {

  showAppCreation: boolean = false;
  deleteModal: boolean = false;
  selectedApp: LuisApp = null;
  
  @Input()
  apps: Array<LuisApp> = [];

  @Output() 
  deletedApp: EventEmitter<string> = new EventEmitter();

  constructor(
    private luisAppService: LuisAppService,
    private notificationService: NotificationService) {}

  ngOnInit(): void {}

  openDeleteModal(luisApp: LuisApp) {
    this.selectedApp = luisApp;
    this.deleteModal = true;
  }

  deleteApp(appName: string) {
    this.luisAppService.deleteApp(appName).subscribe(result => {
      this.selectedApp = null;
      this.deletedApp.emit(appName);
      this.deleteModal = false;
    },
      err => {
        //TO:DO Display Notfication
      }
    )
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
