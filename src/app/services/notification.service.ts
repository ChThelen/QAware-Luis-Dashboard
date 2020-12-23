import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


export enum NotificationType {
  Warning = <any>"warning",
  Info = <any>"info",
  Danger = <any>"danger"
}

export interface NotificationActionLink {
  title: string;
  routerLink: string[];
}

export class Notification {
  constructor(
    public readonly type: NotificationType,
    public readonly message: string,
    public readonly detail: string,
    public readonly link?: NotificationActionLink) {
  }
}

@Injectable()
export class NotificationService {
  private readonly _notifications = new Subject<Notification | null>();

  public readonly notifications = this._notifications.asObservable();

  public add(notification: Notification) {
    if (!notification.message || notification.message.trim() == ""){
      console.error("ERROR NOTIFICATION WITHOUT MESSAGE: " + notification)
    }
    this._notifications.next(notification);
  }

  public flushNotification() {
    this._notifications.next(null);
  }

}
