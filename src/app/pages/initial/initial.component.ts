import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/users/services/user.service';
import { User, UserRole } from 'src/app/models';
import { StringService } from 'src/app/modules/shared/services/string.service';
import { Router } from '@angular/router';
import { ROUTER_PAGES } from 'src/app/constants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss']
})
export class InitialComponent implements OnInit {
  public myUser: User;

  public loading = true;
  public error = false;

  constructor(private userSrv: UserService, public stringSrv: StringService, private router: Router) {}

  ngOnInit(): void {
    this.userSrv
      .checkExistUser()
      .then((myUser: User) => (this.myUser = myUser))
      .catch((error: HttpErrorResponse) => {})
      .finally(() => (this.loading = false));
  }

  public goToMyPage(): void {
    if (this.myUser.role === UserRole.USER) {
      this.router.navigate([ROUTER_PAGES.user.HOME]);
    } else if (this.myUser.role === UserRole.COMPANY_ADMIN) {
      this.router.navigate([ROUTER_PAGES.admin.ADMIN]);
    }
  }
}
