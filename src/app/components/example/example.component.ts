import { Component, OnInit } from '@angular/core';
import { Notification, NotificationService, NotificationType } from 'src/app/services/notification.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {

  constructor(private notification: NotificationService) { }
  
  openModal = false;
  
  ngOnInit(): void {
  }

  showExampleNotification(){
    this.notification.add(
      new Notification(
        NotificationType.Info,
        'Hello - this is a notification.',
        'This is the notifications detail information hopefully helping the user to understand whats going on'
      )
    )
  }

  showExampleModal(){
    this.openModal = true;
  }

}
