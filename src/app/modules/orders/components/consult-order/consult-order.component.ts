import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CODE_ORDER_MAX_LENGTH, CODE_ORDER_MIN_LENGTH, ROUTER_PAGES } from 'src/app/constants';
import { OrderCardMode, Company, Order, ResponseGetOrder, CompanyCardMode, User } from 'src/app/models';
import { OrderService } from 'src/app/modules/orders/services/order.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { StringService } from 'src/app/modules/shared/services/string.service';
import { UserService } from 'src/app/modules/users/services/user.service';
import { isKoResponse } from 'src/app/utils';

@Component({
  selector: 'app-consult-order',
  templateUrl: './consult-order.component.html',
  styleUrls: ['./consult-order.component.scss']
})
export class ConsultOrderComponent implements OnInit {
  @Input() myUser: User;

  public CODE_ORDER_MIN_LENGTH = CODE_ORDER_MIN_LENGTH;
  public CODE_ORDER_MAX_LENGTH = CODE_ORDER_MAX_LENGTH;

  public loading = false;

  public form: FormGroup;

  public order: Order;
  public company: Company;

  get OrderCardModeEnum(): any {
    return OrderCardMode;
  }

  get CompanyCardModeEnum(): any {
    return CompanyCardMode;
  }

  constructor(
    public stringSrv: StringService,
    private fb: FormBuilder,
    private orderSrv: OrderService,
    private router: Router,
    private notificationSrv: NotificationService,
    private userSrv: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      orderCode: [
        '',
        [Validators.required, Validators.minLength(this.CODE_ORDER_MIN_LENGTH), Validators.maxLength(this.CODE_ORDER_MAX_LENGTH)]
      ]
    });

    if (this.myUser === undefined) {
      this.myUser = this.userSrv.getMyUserValue();
    }
  }

  public resetFormControlValue(controlName: string) {
    this.form.get(controlName)?.setValue('');
  }

  public onSubmit(): void {
    this.form.get('orderCode')?.updateValueAndValidity;
    if (!this.form.valid) {
      this.submitError();
    } else {
      this.loading = true;
      this.orderSrv
        .getOrderByCode(this.form.value.orderCode)
        .then((response: ResponseGetOrder) => {
          if (isKoResponse(response)) {
            this.submitError();
          } else if (Object.keys(response?.data)?.length === 0) {
            this.notificationSrv.openWarning(this.stringSrv.getLiteral('notifications.toast', 'checkOrderErrorNoOrder'));
          } else {
            this.order = response.data;
            this.company = response.data.company;
          }
        })
        .catch((error: HttpErrorResponse) => {
          this.submitError();
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  public cardIsLoadingEvent(loading: boolean): void {
    loading ? this.form.get('orderCode')?.disable() : this.form.get('orderCode')?.enable();
  }

  public onAddToMyListEvent(order: Order): void {
    this.router.navigate([ROUTER_PAGES.user.HOME]);
  }

  private submitError(): void {
    this.notificationSrv.openError(this.stringSrv.getLiteral('notifications.toast', 'checkOrderError'));
  }
}
