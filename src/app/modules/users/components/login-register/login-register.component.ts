import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from '@ngneat/dialog';
import { Subscription } from 'rxjs';
import { ROUTER_PAGES } from 'src/app/constants';
import { NotificationToast, User, UserRole } from 'src/app/models';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { StringService } from 'src/app/modules/shared/services/string.service';
import { UserService } from 'src/app/modules/users/services/user.service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegistarComponent implements OnInit, OnDestroy {
  @ViewChild('registerModalTemplate', { read: TemplateRef })
  registerModalTemplate: TemplateRef<any>;

  public MIN_PASSWORD_LENGTH = 6;

  public loginForm: FormGroup;
  public registerForm: FormGroup;

  public hideLoginPassword: boolean = true;
  public loadingLogin: boolean = false;
  public hideRegisterPassword: boolean = true;
  public loadingRegisterModal: boolean = false;

  private dialogBackdropClickRegisterModal$: Subscription;
  private afterClosedRegisterModal$: Subscription;
  private registerFormControls$: Subscription;

  constructor(
    public stringSrv: StringService,
    private dialog: DialogService,
    private fb: FormBuilder,
    private notificationSrv: NotificationService,
    private userSrv: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.MIN_PASSWORD_LENGTH)]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      surnames: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(this.MIN_PASSWORD_LENGTH)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(this.MIN_PASSWORD_LENGTH), this.matchValues('password')]]
    });

    this.registerFormControls$ = this.registerForm.get('password').valueChanges.subscribe(() => {
      this.registerForm.get('passwordConfirmation').updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.registerFormControls$?.unsubscribe();
  }

  public matchValues(matchTo: string): (group: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent && !!control.parent.value && control.value === (control.parent.controls as any)[matchTo].value
        ? null
        : { isMatching: true };
    };
  }

  onClickOpenRegisterModal(): void {
    this.loginForm.reset();
    this.dialog.open(this.registerModalTemplate, { closeButton: true, id: 'registerModal' });
    this.dialogBackdropClickRegisterModal$ = this.dialog.dialogs[0].backdropClick$.subscribe(() => {
      this.onCloseRegisterModalTemplate();
    });
    this.afterClosedRegisterModal$ = this.dialog.dialogs[0].afterClosed$.subscribe(() => {
      this.onCloseRegisterModalTemplate();
    });
  }

  public onClicktRegister(cancel: boolean = false): void {
    this.dialog.dialogs[0].close();
    this.unsubscribe();
  }

  public onSubmitLogin(): void {
    if (this.loginForm.valid) {
      this.loadingLogin = true;
      this.userSrv
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .then((user: User) => {
          if (user.role === UserRole.USER) {
            this.router.navigate([ROUTER_PAGES.user.HOME]);
          } else if (user.role === UserRole.COMPANY_ADMIN) {
            this.router.navigate([ROUTER_PAGES.admin.ADMIN]);
          }
        })
        .catch((error: HttpErrorResponse) => this.openNotificationError(this.stringSrv.getLiteral('notifications.toast', 'loginError')))
        .finally(() => (this.loadingLogin = false));
    }
  }

  public onSubmitRegister(): void {
    if (this.registerForm.valid) {
      this.loadingLogin = true;
      this.userSrv
        .register(
          this.registerForm.value.email,
          this.registerForm.value.password,
          this.registerForm.value.name,
          this.registerForm.value.surnames
        )
        .then((user: User) => {
          this.loginForm.reset();
          this.dialog.closeAll();
          if (user.role === UserRole.USER) {
            this.router.navigate([ROUTER_PAGES.user.HOME]);
          } else if (user.role === UserRole.COMPANY_ADMIN) {
            this.router.navigate([ROUTER_PAGES.admin.ADMIN]);
          }
        })
        .catch((error: HttpErrorResponse) => this.openNotificationError(this.stringSrv.getLiteral('notifications.toast', 'registerError')))
        .finally(() => (this.loadingLogin = false));
    }
  }

  private openNotificationError(notificationLiteral: NotificationToast) {
    this.notificationSrv.openError(notificationLiteral);
  }

  private openNotificationSuccess(notificationLiteral: NotificationToast) {
    this.notificationSrv.openSuccess(notificationLiteral);
  }

  private onCloseRegisterModalTemplate(): void {
    this.registerForm.reset();
    this.unsubscribe();
  }

  private unsubscribe(): void {
    this.dialogBackdropClickRegisterModal$?.unsubscribe();
    this.afterClosedRegisterModal$?.unsubscribe();
  }
}
