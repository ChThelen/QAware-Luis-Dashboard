import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Notification } from '../../services/notification.service';

@Component({
  selector: 'db-notification-banner',
  templateUrl: './notification-banner.component.html',
  styleUrls: ['./notification-banner.component.scss']
})
export class NotificationBannerComponent implements OnInit {
  @Input()
  public notification: Notification;

  @Output()
  public readonly close: EventEmitter<any> = new EventEmitter();
  
  displayMsg: string = "";
  actionButtonLabel = 'Details';
  constructor() { }

  ngOnInit() { 
    this.displayMsg = this.notification.message;
  }

  public onClose() {
    this.close.emit();
  }

  toggleErrorNotificationDetail(){
    this.displayMsg = this.displayMsg == this.notification.message ? this.notification.detail : this.notification.message;
    this.actionButtonLabel = this.actionButtonLabel == 'Details' ? 'Less' : 'Details';
  }

}
