import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Notification} from 'src/app/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

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
