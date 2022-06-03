import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpError, User, UserRole } from 'src/app/models';
import { UserService } from '../../users/services/user.service';
import { NotificationService } from '../services/notification.service';
import { StringService } from '../services/string.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
  constructor(
    private userSrv: UserService,
    private router: Router,
    private notificationSrv: NotificationService,
    private stringSrv: StringService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.userSrv
        .checkExistUser()
        .then((myUser: User) => {
          if (myUser) {
            resolve(true);
          } else {
            this.notificationSrv.openWarning(this.stringSrv.getLiteral('notifications.toast', 'notLogged'));
            this.router.navigate(['']);
            resolve(false);
          }
        })
        .catch((error: HttpErrorResponse) => {
          this.notificationSrv.openError(this.stringSrv.getLiteral('notifications.toast', 'recoveryUserError'));
          this.router.navigate(['']);
          resolve(false);
        });
    });
  }
}
