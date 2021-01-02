import { Component, OnInit, ViewChild } from '@angular/core';
import { DUMMY_APPS, LuisApp } from '../../models/LuisApp';
import { ClrWizard } from "@clr/angular";
import { LuisAppService } from 'src/app/services/luis-app.service';
import { NotificationType, Notification, NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-manage-view',
  templateUrl: './manage-view.component.html',
  styleUrls: ['./manage-view.component.scss']
})
export class ManageViewComponent implements OnInit {
  @ViewChild("createAppWizard") wizard: ClrWizard;

  createWizard: boolean = false;
  deleteModal: boolean = false;
  selectedApp: LuisApp = null;
  apps = [];

  constructor(private luisAppService: LuisAppService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadApps();
  }

  openDeleteModal(luisApp: LuisApp) {
    this.selectedApp = luisApp;
    this.deleteModal = true;
  }

  openCreateWizard() {
    this.createWizard = !this.createWizard;
  }

  deleteApp(appName: string) {
    this.luisAppService.deleteApp(appName).subscribe(result => {
      this.selectedApp = null;
      this.loadApps();
      this.deleteModal = false;
    },
      err => {
        //TO:DO Display Notfication
      }
    )
  }

  loadApps() {
    this.apps = [];
    this.luisAppService.getApps().subscribe(result => {
      this.apps = result;
    });

    // DUMMY DATA
    // this.apps = DUMMY_APPS;

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
