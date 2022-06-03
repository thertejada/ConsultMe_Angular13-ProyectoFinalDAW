import { KeyValue } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { CODE_ORDER_MAX_LENGTH, CODE_ORDER_MIN_LENGTH } from 'src/app/constants';
import { CompanyCardMode, NotificationTypes, Order, OrderCardMode, OrderStatus, ResponseGetOrders, User } from 'src/app/models';
import { DateService } from 'src/app/modules/shared/services/date.service';
import { StringService } from 'src/app/modules/shared/services/string.service';
import { UserService } from 'src/app/modules/users/services/user.service';
import { isKoResponse, isNumeric } from 'src/app/utils';
import { OrderService } from '../../services/order.service';

const enum QUERY_PARAMS {
  PAGE = 'page',
  ITEMS_PER_PAGE = 'itemsPerPage',
  STATUS = 'status',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  ORDER_CODE = 'orderCode'
}

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit, OnDestroy {
  @Input() mode: OrderCardMode;

  @ViewChild('picker') picker: any;

  private routeQueryParams$: Subscription;
  private formEnd$: Subscription;
  private formOrderCode$: Subscription;

  public CODE_ORDER_MAX_LENGTH = CODE_ORDER_MAX_LENGTH;
  public CODE_ORDER_MIN_LENGTH = CODE_ORDER_MIN_LENGTH;
  public PAGE_SIZES: Array<number> = [10, 20, 30];

  public loading = false;
  public error = false;
  public pageSize: number = this.PAGE_SIZES[0];
  public pageSelected: number = 0;
  public pageTotalLength: number;

  public orders: Array<Order> = [];
  public orderSelected: Order;

  public orderStatusKeyValues: Array<KeyValue<string, string>>;
  public selectedStatusFilter: string = '';

  public selectedDateFilterValue: string = '';
  public startDate: Date;
  public endDate: Date;

  public orderCode: string;

  public myUser: User;

  public form = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
    orderCode: new FormControl('')
  });

  get OrderStatusEnum(): any {
    return OrderStatus;
  }

  get OrderCardModeEnum(): any {
    return OrderCardMode;
  }

  get CompanyCardModeEnum(): any {
    return CompanyCardMode;
  }

  get NotificationTypesEnum(): any {
    return NotificationTypes;
  }

  constructor(
    private orderSrv: OrderService,
    private userSrv: UserService,
    private router: Router,
    public stringSrv: StringService,
    private route: ActivatedRoute,
    private dateSrv: DateService
  ) {}

  ngOnInit(): void {
    this.myUser = this.userSrv.getMyUserValue();
    this.setLoading(true);
    this.orderStatusKeyValues = this.stringSrv.getOrderStatusKeyLiteral();
    this.subscribe();
  }

  ngOnDestroy(): void {
    this.routeQueryParams$?.unsubscribe();
    this.formEnd$?.unsubscribe();
    this.formOrderCode$?.unsubscribe();
  }

  private subscribe(): void {
    this.routeQueryParams$ = this.route.queryParams.subscribe((queryParams: Params) => {
      if (queryParams != null && Object.keys(queryParams)?.length > 0 && !this.isValidQueryParams(queryParams)) {
        this.error = true;
        return;
      }
      const pageSizeParam = queryParams?.[QUERY_PARAMS.ITEMS_PER_PAGE];
      const pageSelectedParam = queryParams?.[QUERY_PARAMS.PAGE];
      const statusParam = queryParams?.[QUERY_PARAMS.STATUS];
      const startDateParam = queryParams?.[QUERY_PARAMS.START_DATE];
      const endDateParam = queryParams?.[QUERY_PARAMS.END_DATE];
      const orderCodeParam = queryParams?.[QUERY_PARAMS.ORDER_CODE];

      this.pageSize = pageSizeParam ? parseInt(pageSizeParam) : this.PAGE_SIZES[0];
      this.pageSelected = pageSelectedParam ? parseInt(pageSelectedParam) : 0;

      this.selectedStatusFilter = statusParam ?? '';

      this.startDate =
        startDateParam != null && this.dateSrv.isValidDate(startDateParam) ? this.dateSrv.getDate(startDateParam) : undefined;
      this.endDate = endDateParam != null && this.dateSrv.isValidDate(endDateParam) ? this.dateSrv.getDate(endDateParam) : undefined;
      if (this.startDate && this.endDate) {
        if (startDateParam === endDateParam && startDateParam === this.dateSrv.getDateStrFormated(moment().toDate())) {
          this.selectedDateFilterValue = 'TODAY';
        } else {
          this.selectedDateFilterValue = 'CUSTOM';
        }
      } else {
        this.selectedDateFilterValue = '';
      }
      this.form.get('start').setValue(this.startDate);
      this.form.get('end').setValue(this.endDate);

      if (this.form.get('orderCode').value != orderCodeParam) {
        this.orderCode = orderCodeParam;
        this.form.get('orderCode').setValue(orderCodeParam);
      }

      this.loadOrders();
    });

    this.formEnd$ = this.form.get('end').valueChanges.subscribe((endDate: Date) => {
      if (!this.loading) {
        const startDate = this.form.get('start').value;
        if (
          endDate &&
          (this.dateSrv.getDateStrFormated(this.startDate) !== this.dateSrv.getDateStrFormated(startDate) ||
            this.dateSrv.getDateStrFormated(this.endDate) !== this.dateSrv.getDateStrFormated(endDate))
        ) {
          this.startDate = startDate;
          this.endDate = endDate;
          this.navigate();
        }
      }
    });

    this.formOrderCode$ = this.form.get('orderCode').valueChanges.subscribe((orderCode: string) => {
      if (orderCode?.length === 0 || orderCode?.length === this.CODE_ORDER_MAX_LENGTH) {
        if (this.orderCode !== orderCode) {
          this.orderCode = orderCode;
          if (orderCode?.length === this.CODE_ORDER_MAX_LENGTH) {
            this.form.get('end').setValue(undefined);
            this.endDate = undefined;
            this.form.get('start').setValue(undefined);
            this.startDate = undefined;
            this.selectedDateFilterValue = '';
            this.selectedStatusFilter = '';
          }

          this.navigate();
        }
      } else {
        this.orderCode = '';
      }
    });
  }

  private isValidQueryParams(queryParams: Params): boolean {
    const itemsPerPage = queryParams?.[QUERY_PARAMS.ITEMS_PER_PAGE];
    const page = queryParams?.[QUERY_PARAMS.PAGE];
    const VALID_PAGES =
      (itemsPerPage == null && page == null) ||
      (itemsPerPage != null &&
        this.PAGE_SIZES.some((pageSize: number) => pageSize.toString() === itemsPerPage) &&
        isNumeric(itemsPerPage) &&
        (page == null || (page != null && isNumeric(page))));

    const status = queryParams?.[QUERY_PARAMS.STATUS];
    const VALID_STATUS = status == null || (status != null && Object.values(OrderStatus).some((status: string) => status === status));

    const startDate = queryParams?.[QUERY_PARAMS.START_DATE];
    const endDate = queryParams?.[QUERY_PARAMS.END_DATE];
    const VALID_DATE =
      (startDate == null && endDate == null) ||
      (startDate != null &&
        endDate != null &&
        this.dateSrv.isValidDate(startDate) &&
        this.dateSrv.isValidDate(endDate) &&
        this.dateSrv.isValidDateRange(startDate, endDate));

    const orderCode = queryParams?.[QUERY_PARAMS.ORDER_CODE];
    const VALID_ORDER_CODE = orderCode == null || (orderCode != null && orderCode.length === this.CODE_ORDER_MAX_LENGTH);

    return VALID_PAGES && VALID_STATUS && VALID_DATE && VALID_ORDER_CODE;
  }

  public onPaginatorChange(pageEvent: PageEvent): void {
    this.pageSelected = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.navigate();
  }

  public statusListDefaultValueStr(): string {
    return this.stringSrv
      .getLiteral('ordersList.filter.status.all')
      ?.replace('{0}', this.orderStatusKeyValues.find((status: KeyValue<string, string>) => status.key === OrderStatus.DELIVERED)?.value);
  }

  public onStatusFilter(): void {
    this.navigate();
  }

  public onDateFilter(): void {
    if (this.selectedDateFilterValue !== 'CUSTOM') {
      this.navigate();
    } else {
      this.form.get('start').setValue(undefined);
      this.form.get('end').setValue(undefined);
    }
  }

  private loadOrders(): void {
    const isCompanyAdminMode = this.mode === OrderCardMode.COMPANY_ADMIN;
    const myCompanyId = this.myUser?.company?.id;
    if (isCompanyAdminMode && myCompanyId == null) {
      this.error = true;
    } else {
      this.setLoading(true);

      let startDate: string;
      let endDate: string;
      if (this.selectedDateFilterValue === 'CUSTOM') {
        startDate = this.startDate ? this.dateSrv.getDateStrFormated(this.startDate) : undefined;
        endDate = this.endDate ? this.dateSrv.getDateStrFormated(this.endDate) : undefined;
      } else if (this.selectedDateFilterValue === 'TODAY') {
        startDate = this.dateSrv.getDateStrFormated(new Date());
        endDate = this.dateSrv.getDateStrFormated(new Date());
      }

      const limit = this.pageSize;
      const offset = this.pageSelected * this.pageSize;
      this.orderSrv
        .getOrders(
          {
            status: this.selectedStatusFilter !== '' ? (this.selectedStatusFilter as OrderStatus) : undefined,
            startDate: startDate,
            endDate: endDate,
            orderCode: this.orderCode !== '' ? this.orderCode : undefined
          },
          isCompanyAdminMode ? undefined : this.myUser?.id,
          isCompanyAdminMode ? myCompanyId : undefined,
          limit,
          offset
        )
        .then((response: ResponseGetOrders) => {
          if (isKoResponse(response)) {
            this.error = true;
          } else {
            this.pageTotalLength = response.data.total;
            this.orders = response.data.orders;
            if (this.orders?.length === 0 && this.pageTotalLength < (this.pageSelected + 1) * limit && this.pageSelected > 0) {
              this.pageSelected--;
              this.loadOrders();
            }
          }
        })
        .catch((error: HttpErrorResponse) => (this.error = true))
        .finally(() => this.setLoading(false));
    }
  }

  public emptyFormControlValue(controlName: string): void {
    this.form.get(controlName).setValue('');
  }

  public reloadRoute(): void {
    const currentUrl = this.router.url.split('?')[0];
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.navigate(currentUrl));
  }

  private navigate(url?: string): void {
    let startDate: string;
    let endDate: string;
    if (this.selectedDateFilterValue === 'CUSTOM') {
      startDate = this.startDate ? this.dateSrv.getDateStrFormated(this.startDate) : undefined;
      endDate = this.endDate ? this.dateSrv.getDateStrFormated(this.endDate) : undefined;
    } else if (this.selectedDateFilterValue === 'TODAY') {
      startDate = this.dateSrv.getDateStrFormated(new Date());
      endDate = this.dateSrv.getDateStrFormated(new Date());
    }

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    const PAGE_SIZE = this.pageSize !== this.PAGE_SIZES[0];
    const PAGE_SELECTED = this.pageSelected !== 0;
    const STATUS_FILTER_SELECTED = this.selectedStatusFilter !== '';
    const START_DATE_FILTER_SELECTED = startDate != null && startDate !== '';
    const END_DATE_SELECTED = endDate != null && endDate !== '';
    const ORDER_CODE = this.orderCode !== '';
    this.router.navigate(url ? [url] : [], {
      ...navigationExtras,
      queryParams: {
        [QUERY_PARAMS.ITEMS_PER_PAGE]: PAGE_SELECTED || PAGE_SIZE ? this.pageSize : undefined,
        [QUERY_PARAMS.PAGE]: PAGE_SELECTED ? this.pageSelected : undefined,
        [QUERY_PARAMS.STATUS]: STATUS_FILTER_SELECTED ? this.selectedStatusFilter : undefined,
        [QUERY_PARAMS.START_DATE]: START_DATE_FILTER_SELECTED && END_DATE_SELECTED ? startDate : undefined,
        [QUERY_PARAMS.END_DATE]: END_DATE_SELECTED && START_DATE_FILTER_SELECTED ? endDate : undefined,
        [QUERY_PARAMS.ORDER_CODE]: ORDER_CODE ? this.orderCode : undefined
      }
    });
  }

  private setLoading(loading: boolean): void {
    loading ? this.form.disable() : this.form.enable();
    this.loading = loading;
  }
}
