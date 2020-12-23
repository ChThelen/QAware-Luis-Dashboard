import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'thb2020-frontend';



  constructor(private readonly notifications: NotificationService) { }

  public notification: Notification | null = null;
  public shouldDisplayNotification = false;

  ngOnInit() {


  this.notifications.notifications.subscribe(x => { 
    this.shouldDisplayNotification = false;
    setTimeout(() => {
      this.notification = x;
      this.shouldDisplayNotification = true;  
    }, 25);
  });
  }

}
