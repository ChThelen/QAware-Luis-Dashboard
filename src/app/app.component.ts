import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification} from './services/notification.service';
import { environment } from 'src/environments/runtime-environment';

const darkThemeStyleSheet = document.styleSheets[2];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  public notification: Notification | null = null;
  public shouldDisplayNotification = false;
  public environment = environment;

  constructor(private readonly notificationService: NotificationService){}

  darkThemeIsActive = false;
  
  ngOnInit(): void {
    darkThemeStyleSheet.disabled = !this.darkThemeIsActive;

    this.notificationService.notifications.subscribe(x => { 
      this.shouldDisplayNotification = false;
      setTimeout(() => {
        this.notification = x;
        this.shouldDisplayNotification = true;  
      }, 25);
    });
    }

  switchTheme() {
    this.darkThemeIsActive = !this.darkThemeIsActive;
    darkThemeStyleSheet.disabled = !this.darkThemeIsActive;
  }

}
