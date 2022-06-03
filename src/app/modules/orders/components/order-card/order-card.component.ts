import { KeyValue } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTER_PAGES } from 'src/app/constants';
import { OrderCardMode, Order, ResponseSusscess, ConfirmModalConfig, User, OrderStatus } from 'src/app/models';
import { NotificationService } from 'src/app/modules/shared/services/notification.service';
import { StringService } from 'src/app/modules/shared/services/string.service';
import { isKoResponse } from 'src/app/utils';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss']
})
export class OrderCardComponent implements OnInit {
  @Output() public orderAddedToMyList: EventEmitter<Order> = new EventEmitter();
  @Output() public orderUpdated: EventEmitter<void> = new EventEmitter();
  @Output() public isLoading: EventEmitter<boolean> = new EventEmitter();
  @Input() public order: Order;
  @Input() public mode: OrderCardMode;
  @Input() public fullMode: boolean = false;
  @Input() public myUser: User;

  public loading = false;

  public confirmModal: ConfirmModalConfig;

  public nextOrderStatus: KeyValue<string, string>;
  public nextOrderStatusLiteral: string;

  get CardModeEnum(): any {
    return OrderCardMode;
  }

  get OrderStatusEnum(): any {
    return OrderStatus;
  }

  constructor(
    public stringSrv: StringService,
    private orderSrv: OrderService,
    private notificationSrv: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.mode === OrderCardMode.COMPANY_ADMIN) {
      this.calculateNextOrderStatusLiteral();
    }
  }

  public onClickAddOrderToMyList(): void {
    this.setIsLoading(true);
    this.orderSrv
      .addOrderToMyList(this.order.id, this.myUser.id)
      .then((response: ResponseSusscess) => {
        if (isKoResponse(response)) {
          this.addOrderToMyListNotificationError();
        } else {
          this.notificationSrv.openSuccess(this.stringSrv.getLiteral('notifications.toast', 'addOrderToMyListSuccess'));
          this.orderAddedToMyList.emit(this.order);
        }
      })
      .catch((error: HttpErrorResponse) => {
        if (error?.error?.code === 3002) {
          this.notificationSrv.openWarning(this.stringSrv.getLiteral('notifications.toast', 'addOrderToMyListErrorExisting'));
        } else {
          this.addOrderToMyListNotificationError();
        }
      })
      .finally(() => {
        this.setIsLoading(false);
      });
  }

  public onClickDeleteOrder(openModal: boolean = false): void {
    if (openModal) {
      this.confirmModal = {
        title: this.stringSrv.getLiteral('question.deleteOrder.title'),
        message:
          this.mode === OrderCardMode.COMPANY_ADMIN
            ? this.stringSrv.getLiteral('question.deleteOrderAdmin.message')
            : this.stringSrv.getLiteral('question.deleteOrderUser.message'),
        acceptBtn: this.stringSrv.getLiteral('accept'),
        cancelBtn: this.stringSrv.getLiteral('cancel'),
        isEnabled: true,
        type: 1
      };
    } else {
      this.setIsLoading(true);
      this.orderSrv
        .removeOrderToMyList(this.order.id, this.myUser.id)
        .then((response: ResponseSusscess) => {
          if (isKoResponse(response)) {
            this.deleteOrderNotificationError();
          } else {
            this.notificationSrv.openSuccess(this.stringSrv.getLiteral('notifications.toast', 'deleteOrderSuccess'));
            this.orderUpdated.emit();
          }
        })
        .catch((error: HttpErrorResponse) => {
          this.deleteOrderNotificationError();
        })
        .finally(() => {
          this.setIsLoading(false);
        });
    }
  }

  public onClickUpdateCompanyOrderToNextStatus(openModal: boolean = false): void {
    if (openModal) {
      this.confirmModal = {
        title: this.stringSrv.getLiteral('question.updateCompanyOrderToNextStatus.title'),
        message: this.stringSrv.getLiteral('question.updateCompanyOrderToNextStatus.message')?.replace('{0}', this.nextOrderStatus?.value),
        acceptBtn: this.stringSrv.getLiteral('accept'),
        cancelBtn: this.stringSrv.getLiteral('cancel'),
        isEnabled: true,
        type: 2
      };
    } else {
      this.setIsLoading(true);
      this.orderSrv
        .updateOrder({ ...this.order, status: this.nextOrderStatus.key as OrderStatus })
        .then((response: ResponseSusscess) => {
          if (isKoResponse(response)) {
            this.updateOrderNotificationError();
          } else {
            this.notificationSrv.openSuccess(this.stringSrv.getLiteral('notifications.toast', 'updateOrderSuccess'));
            this.orderUpdated.emit();
          }
        })
        .catch((error: HttpErrorResponse) => {
          this.updateOrderNotificationError();
        })
        .finally(() => {
          this.setIsLoading(false);
        });
    }
  }

  public isUpdateCompanyOrderToNextStatusDisabled(): boolean {
    return !this.nextOrderStatus?.key;
  }

  public onClickModal(cancelAction: boolean = false): void {
    if (!cancelAction) {
      const types: any = {
        1: () => this.onClickDeleteOrder(),
        2: () => this.onClickUpdateCompanyOrderToNextStatus()
      };
      types[this.confirmModal.type]();
    }
    this.confirmModal = undefined;
  }

  public getStatusIcon(): string {
    const types: any = {
      [OrderStatus.PENDING]: 'hourglass',
      [OrderStatus.READY_TO_PICK_UP]: 'truck',
      [OrderStatus.DELIVERED]: 'check'
    };

    return types[this.order.status];
  }

  public getOrderAddress(): string {
    return `${this.order.company?.street}, ${this.order.company?.doorNumber} ${this.order.company?.doorLetter ?? ''}, ${
      this.order.company?.postalCode
    } ${this.order.company?.city}, ${this.order.company?.province}, ${this.order.company?.country}`;
  }

  public onClickEditOrder(): void {
    if (this.mode === OrderCardMode.COMPANY_ADMIN) {
      this.router.navigate([ROUTER_PAGES.admin.NEW_ORDER, this.order.code]);
    }
  }

  private calculateNextOrderStatusLiteral(): void {
    const orderStatusKeyValues: Array<KeyValue<string, string>> = this.stringSrv.getOrderStatusKeyLiteral();
    const currentOrderStatusIndex: number = orderStatusKeyValues.findIndex(
      (status: KeyValue<string, string>) => status.key === this.order.status
    );

    this.nextOrderStatus = orderStatusKeyValues[currentOrderStatusIndex + 1];
    if (this.nextOrderStatus) {
      this.nextOrderStatusLiteral = this.stringSrv.getLiteral('updateOrderToNextStatus')?.replace('{0}', this.nextOrderStatus?.value);
    }
  }

  private updateOrderNotificationError() {
    this.notificationSrv.openError(this.stringSrv.getLiteral('notifications.toast', 'updateOrderError'));
  }

  private deleteOrderNotificationError() {
    this.notificationSrv.openError(this.stringSrv.getLiteral('notifications.toast', 'deleteOrderError'));
  }

  private setIsLoading(value: boolean) {
    this.loading = value;
    this.isLoading.emit(value);
  }

  private addOrderToMyListNotificationError() {
    this.notificationSrv.openError(this.stringSrv.getLiteral('notifications.toast', 'addOrderToMyListError'));
  }
}
