import { Component, Input, OnInit } from '@angular/core';
import { NotificationComp, NotificationTypes } from 'src/app/models';
import { StringService } from '../../services/string.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Input() public type: NotificationTypes = NotificationTypes.ERROR;
  @Input() public notification: NotificationComp;

  get notificationType(): any {
    return NotificationTypes;
  }

  constructor(public stringSrv: StringService) {}

  ngOnInit(): void {
    if (this.notification == null) {
      this.notification = this.stringSrv.getLiteral('notifications.errors', 'generic');
    }
  }
}
