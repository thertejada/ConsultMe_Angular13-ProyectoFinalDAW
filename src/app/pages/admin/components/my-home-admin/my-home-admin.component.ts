import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { ROUTER_PAGES } from 'src/app/constants';
import { NotificationComp, OrderStatus, ResponseGetAnalytics, StatData } from 'src/app/models';
import { DateService } from 'src/app/modules/shared/services/date.service';
import { AnalyticService } from 'src/app/modules/shared/services/analytic.service';
import { StringService } from 'src/app/modules/shared/services/string.service';
import { UserService } from 'src/app/modules/users/services/user.service';
import { isKoResponse } from 'src/app/utils';

@Component({
  selector: 'app-my-home-admin',
  templateUrl: './my-home-admin.component.html',
  styleUrls: ['./my-home-admin.component.scss']
})
export class MyHomeAdminComponent implements OnInit {
  public lodingPendingOrders = true;
  public errorPendingOrders = false;
  public pendingOrdersTotalLength: number;
  public pendingOrdersError: NotificationComp;
  public pendingOrdersTxt: string;

  public lodingCompanyOrdersStats = true;
  public errorCompanyOrdersStats = false;
  public companyOrdersError: NotificationComp;
  public companyOrdersStats: Array<StatData>;
  public xAxisLabelCompanyOrdersStats: string;
  public yAxisLabelCompanyOrdersStats: string;

  public lodingPieChartStats = true;
  public errorPieChartStats = false;
  public pieChartStats: Array<StatData>;
  public pieChartLabel: string;

  constructor(
    private userSrv: UserService,
    public stringSrv: StringService,
    private statsSrv: AnalyticService,
    private router: Router,
    private dateSrv: DateService
  ) {}

  ngOnInit(): void {
    this.pendingOrdersError = this.stringSrv.getLiteral('notifications.errors', 'company.pendingOrders');
    this.companyOrdersError = this.stringSrv.getLiteral('notifications.errors', 'company.orders.stats');

    const companyId = this.userSrv.getMyUserValue().company.id;
    this.loadPendingOrdersToday(companyId);
    this.loadCountOrdersTomorrowGroupByStatus(companyId);
    this.loadOrdersCreatedInLastNumberOfDays(companyId);
  }

  private loadPendingOrdersToday(myCompanyId: number): void {
    this.lodingPendingOrders = true;
    this.statsSrv
      .getCountCompanyOrdersByDateGroupByStatus(myCompanyId, moment().toDate())
      .then((response: ResponseGetAnalytics) => {
        if (isKoResponse(response)) {
          this.errorPendingOrders = true;
        } else {
          const stat: StatData = response.data.find((value: StatData) => value.name === OrderStatus.READY_TO_PICK_UP);
          this.pendingOrdersTxt =
            stat?.value === 1
              ? this.stringSrv.getLiteral('stats.company.pending.orders.html.singular')?.replace('{0}', stat?.value)
              : this.stringSrv.getLiteral('stats.company.pending.orders.html.plural')?.replace('{0}', stat?.value);
          this.pendingOrdersTotalLength = stat?.value;
        }
      })
      .catch((error: HttpErrorResponse) => (this.errorPendingOrders = true))
      .finally(() => (this.lodingPendingOrders = false));
  }

  private loadCountOrdersTomorrowGroupByStatus(myCompanyId: number): void {
    this.lodingPieChartStats = true;
    this.statsSrv
      .getCountCompanyOrdersByDateGroupByStatus(myCompanyId, moment().add(1, 'days').toDate())
      .then((response: ResponseGetAnalytics) => {
        if (isKoResponse(response)) {
          this.errorPieChartStats = true;
        } else {
          const totalValues: number = response.data.reduce((acc: number, value: StatData) => (acc += value.value), 0);
          this.pieChartLabel = this.stringSrv.getLiteral(
            'charts',
            `COUNT_TOMORROW_ORDERS_BY_STATUS_${totalValues === 1 ? 'SINGULAR' : 'PLURAL'}`,
            'xAxisLabel'
          );
          this.pieChartStats = response.data?.map((stat: StatData) => ({
            ...stat,
            name: this.stringSrv.getLiteral('orderStatus', stat.name)
          }));
        }
      })
      .catch((error: HttpErrorResponse) => (this.errorPieChartStats = true))
      .finally(() => {
        this.lodingPieChartStats = false;
      });
  }

  private loadOrdersCreatedInLastNumberOfDays(myCompanyId: number): void {
    this.lodingCompanyOrdersStats = true;
    this.statsSrv
      .getOrdersCreatedInLastNumberOfDays(myCompanyId, '7')
      .then((response: ResponseGetAnalytics) => {
        if (isKoResponse(response)) {
          this.errorCompanyOrdersStats = true;
        } else {
          this.xAxisLabelCompanyOrdersStats = this.stringSrv.getLiteral('charts', 'ORDERS_CREATED_LAST_DAYS', 'xAxisLabel');
          this.yAxisLabelCompanyOrdersStats = this.stringSrv.getLiteral('charts', 'ORDERS_CREATED_LAST_DAYS', 'yAxisLabel');
          this.companyOrdersStats = response.data?.map((stat: StatData) => ({
            ...stat,
            name: this.dateSrv.getDateStrDdMm(this.dateSrv.getDate(stat.name))
          }));
        }
      })
      .catch((error: HttpErrorResponse) => (this.errorCompanyOrdersStats = true))
      .finally(() => {
        this.lodingCompanyOrdersStats = false;
      });
  }

  public goToPendingOrders(): void {
    const todayStr = this.dateSrv.getDateStrFormated(moment().toDate());
    this.router.navigate([ROUTER_PAGES.admin.ADMIN_ORDERS], {
      queryParams: {
        status: OrderStatus.READY_TO_PICK_UP,
        startDate: todayStr,
        endDate: todayStr
      }
    });
  }
}
