import { KeyValue } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CODE_ORDER_MAX_LENGTH, ROUTER_PAGES, ROUTER_PAGES_PARTS } from 'src/app/constants';
import { ConfirmModalConfig, Order, OrderStatus, ResponseGetOrder, ResponseSusscess } from 'src/app/models';
import { OrderService } from 'src/app/modules/orders/services/order.service';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { StringService } from 'src/app/modules/shared/services/string.service';
import { UserService } from 'src/app/modules/users/services/user.service';
import { isKoResponse } from 'src/app/utils';

@Component({
  selector: 'app-new-edit-order',
  templateUrl: './new-edit-order.component.html',
  styleUrls: ['./new-edit-order.component.scss']
})
export class NewEditOrderComponent implements OnInit, OnDestroy {
  public MAX_LENGTH_TITLE = 30;
  public MINIMUM_LENGTH_TITLE = 5;
  public MAX_LENGTH_DESCRIPTION = 254;
  public MAX_LENGTH_COMPANY_ID = 5;

  private routeSub: Subscription;
  public loading = false;
  public isEditableMode = false;
  public error = false;
  public confirmModal: ConfirmModalConfig;

  public form: FormGroup;
  public formHasChange = false;
  public today: Date = new Date();
  public orderCode: string;
  public orderStatusKeyValues: Array<KeyValue<string, string>>;
  public orderToUpdate: Order;

  constructor(
    public stringSrv: StringService,
    private fb: FormBuilder,
    private userSrv: UserService,
    private orderSrv: OrderService,
    private notificationSrv: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isEditableMode = this.route.snapshot?.params[ROUTER_PAGES_PARTS.NEW_COMPANY_ORDER_CODE_ID] != null;
    if (this.isEditableMode) {
      this.loading = true;
      this.confirmModal = {
        title: this.stringSrv.getLiteral('question.deleteOrder.title'),
        message: this.stringSrv.getLiteral('question.deleteOrderAdmin.message'),
        acceptBtn: this.stringSrv.getLiteral('accept'),
        cancelBtn: this.stringSrv.getLiteral('cancel'),
        isEnabled: false
      };
    }
    this.initOrderStatusKeyValues();
    this.initForm();
    this.checkRouteCodeParam();
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }

  private checkRouteCodeParam(): void {
    if (this.isEditableMode) {
      this.routeSub = this.route.params.subscribe((params: Params) => {
        const orderCode: string = params[ROUTER_PAGES_PARTS.NEW_COMPANY_ORDER_CODE_ID];
        if (orderCode) {
          this.checkOrder(orderCode);
        } else {
          this.error = true;
          this.loading = false;
        }
      });
    } else {
      this.generateOrderCode();
      this.loading = false;
    }
  }

  private checkOrder(orderCode: string): void {
    this.orderSrv
      .getOrderByCode(orderCode)
      .then((response: ResponseGetOrder) => {
        if (isKoResponse(response)) {
          this.checkOrderError();
        } else {
          this.orderToUpdate = response.data;
          this.orderCode = response.data.code;
          this.setFormControlValue('title', response.data.title);
          this.setFormControlValue('description', response.data?.description);
          this.setFormControlValue('date', response.data?.date);
          this.setFormControlValue('price', response.data?.price);
          this.setFormControlValue('status', response.data.status);
          this.onFormValueChange();
        }
      })
      .catch((error: HttpErrorResponse) => {
        this.checkOrderError();
      })
      .finally(() => {
        this.loading = false;
      });
  }

  private checkOrderError(): void {
    this.error = true;
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(this.MINIMUM_LENGTH_TITLE)]],
      description: ['', []],
      date: ['', [Validators.required]],
      price: ['', []],
      status: [OrderStatus.PENDING, [Validators.required]]
    });
  }

  private onFormValueChange() {
    const initialValue = this.form.value;
    this.form.valueChanges.subscribe((value: any) => {
      this.formHasChange = Object.keys(initialValue).some((key) => this.form.value[key] != initialValue[key]);
    });
  }

  private initOrderStatusKeyValues(): void {
    this.orderStatusKeyValues = this.stringSrv.getOrderStatusKeyLiteral();
  }

  private generateOrderCode(): void {
    const companyCode: string = this.userSrv.getMyUserValue().company.code.toString().padStart(this.MAX_LENGTH_COMPANY_ID, '0');
    let codeStr: string = `${companyCode}${Date.now().toString()}`;
    while (codeStr.length < CODE_ORDER_MAX_LENGTH) {
      codeStr += Math.floor(Math.random() * (9 - 0 + 1) + 0).toString();
    }
    this.orderCode = codeStr.trim();
  }

  private submitError(): void {
    this.notificationSrv.openError(
      this.stringSrv.getLiteral('notifications.toast', this.isEditableMode ? 'updateOrderError' : 'addNewOrderError')
    );
  }

  private updateOrder(order: Order): void {
    this.orderSrv
      .updateOrder({ ...this.orderToUpdate, ...order })
      .then((response: ResponseSusscess) => {
        if (isKoResponse(response)) {
          this.submitError();
        } else {
          this.notificationSrv.openSuccess(this.stringSrv.getLiteral('notifications.toast', 'updateOrderSuccess'));
          this.router.navigate([ROUTER_PAGES.admin.ADMIN_ORDERS]);
        }
      })
      .catch((error: HttpErrorResponse) => {
        this.submitError();
      })
      .finally(() => {
        this.loading = false;
      });
  }

  private createOrder(order: Order): void {
    this.orderSrv
      .addOrder({
        ...order,
        code: this.orderCode,
        company: {
          id: this.userSrv.getMyUserValue().company.id
        }
      })
      .then((response: ResponseSusscess) => {
        if (isKoResponse(response)) {
          this.submitError();
        } else {
          this.notificationSrv.openSuccess(this.stringSrv.getLiteral('notifications.toast', 'addNewOrderSuccess'));
          this.router.navigate([ROUTER_PAGES.admin.ADMIN_ORDERS]);
        }
      })
      .catch((error: HttpErrorResponse) => {
        this.submitError();
      })
      .finally(() => {
        this.loading = false;
      });
  }

  public isBtnDisabled(): boolean {
    if (this.isEditableMode) {
      return !this.form.valid || !this.formHasChange;
    }
    return !this.form.valid;
  }

  public onSubmit(): void {
    if (!this.form.valid || this.orderCode == null || this.orderCode === '') {
      this.submitError();
    } else {
      this.loading = true;
      const order: Order = {
        title: this.form.get('title').value,
        description: this.form.get('description')?.value,
        price: this.form.get('price')?.value,
        date: this.form.get('date')?.value,
        status: this.form.get('status').value
      };
      if (this.isEditableMode) {
        this.updateOrder(order);
      } else {
        this.createOrder(order);
      }
    }
  }

  public resetFormControlValue(controlName: string) {
    this.form.get(controlName)?.setValue('');
  }

  public setFormControlValue(controlName: string, value: any) {
    this.form.get(controlName)?.setValue(value);
  }
}
