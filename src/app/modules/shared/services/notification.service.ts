import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationToast } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  private open(notification: NotificationToast, cssClasses: Array<string>) {
    const IS_MOBILE = window.innerWidth <= 768;

    this.snackBar.open(notification.message, notification.button, {
      duration: notification.duration,
      horizontalPosition: notification.horizontalPosition ?? 'center',
      verticalPosition: IS_MOBILE ? 'bottom' : notification.verticalPosition ?? 'top',
      panelClass: cssClasses
    });
  }

  public openError(notification: NotificationToast) {
    this.open(notification, ['notification-error']);
  }

  public openSuccess(notification: NotificationToast) {
    this.open(notification, ['notification-success']);
  }

  public openWarning(notification: NotificationToast) {
    this.open(notification, ['notification-warning']);
  }
}
