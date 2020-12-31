import { Component, OnInit, ViewChild} from '@angular/core';
import {DUMMY_APPS, LuisApp} from '../../models/LuisApp';
import {ClrWizard} from "@clr/angular";
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
  selectedApp: LuisApp = DUMMY_APPS[0];

  // DUMMY DATA REMOVE LATER
  apps = DUMMY_APPS;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
  }

  openDeleteModal(luisApp: LuisApp){
    this.selectedApp = luisApp;
    this.deleteModal = true;
  }

  openCreateWizard(){
    this.createWizard = !this.createWizard;
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
