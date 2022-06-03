import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTER_PAGES } from 'src/app/constants';
import { ConfirmModalConfig, User, UserRole } from 'src/app/models';
import { UserService } from 'src/app/modules/users/services/user.service';
import { StringService } from '../../services/string.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public myUser: User;

  public confirmModal: ConfirmModalConfig;

  public changePageMode: {
    btnLiteral?: string;
    routerUrl?: string;
    userMode: boolean;
    companyAdminMode: boolean;
  } = {
    userMode: false,
    companyAdminMode: false
  };

  get UserRoleEnum(): any {
    return UserRole;
  }

  constructor(public stringSrv: StringService, private router: Router, private userSrv: UserService) {}

  ngOnInit(): void {
    this.myUser = this.userSrv.getMyUserValue();

    if (this.router.url.startsWith(ROUTER_PAGES.admin.ADMIN)) {
      this.changePageMode.btnLiteral = 'go.to.normalPage';
      this.changePageMode.routerUrl = ROUTER_PAGES.user.HOME;
      this.changePageMode.companyAdminMode = true;
    } else if (this.router.url.startsWith(ROUTER_PAGES.user.HOME)) {
      this.changePageMode.btnLiteral = 'go.to.adminPage';
      this.changePageMode.routerUrl = ROUTER_PAGES.admin.ADMIN;
      this.changePageMode.userMode = true;
    }

    this.confirmModal = {
      title: this.stringSrv.getLiteral('question.logout.title'),
      message: this.stringSrv.getLiteral('question.logout.message'),
      acceptBtn: this.stringSrv.getLiteral('accept'),
      cancelBtn: this.stringSrv.getLiteral('cancel'),
      isEnabled: false
    };
  }

  public goToCheckPage() {
    this.router.navigate([ROUTER_PAGES.user.HOME_CHECk]);
  }

  public navigateToInitialPage() {
    const url: Array<string> = this.router.url.split('/');
    const initialUrl = `/${url[1]}`;
    const urlWithoutParams: string = initialUrl.split('?')[0];
    this.router.navigate([urlWithoutParams]);
  }

  public onClickModal(cancelAction: boolean = false): void {
    if (!cancelAction) {
      this.onClickLogout();
    }
    this.confirmModal.isEnabled = false;
  }

  public onClickLogout() {
    if (!this.confirmModal.isEnabled) {
      this.confirmModal.isEnabled = true;
    } else {
      this.userSrv.logout();
      this.router.navigate([ROUTER_PAGES.INITIAL]);
    }
  }

  public goToChangePageMode() {
    if (this.changePageMode?.routerUrl) {
      this.router.navigate([this.changePageMode.routerUrl]);
    }
  }

  public goToNewCompanyOrder() {
    this.router.navigateByUrl(ROUTER_PAGES.admin.NEW_ORDER);
  }

  public goToCompanyOrders() {
    this.router.navigate([ROUTER_PAGES.admin.ADMIN_ORDERS]);
  }
}
