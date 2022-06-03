import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { COOKIE_TOKEN } from 'src/app/constants';
import { AnalyticsType, ResponseGetAnalytics } from 'src/app/models';
import { getAuthorizationHeader } from 'src/app/utils';
import { environment } from 'src/environments/environment';
import { CookieService } from './cookie.service';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticService {
  constructor(private cookieSrv: CookieService, private http: HttpClient, private dateSrv: DateService) {}

  getOrdersCreatedInLastNumberOfDays(companyId: number, numberOfDays: string): Promise<any> {
    const url = `${environment.apiBasepath}/analytics/company/${companyId}`;
    const token = this.cookieSrv.getCookie(COOKIE_TOKEN);

    return firstValueFrom(
      this.http.get<ResponseGetAnalytics>(url, {
        headers: getAuthorizationHeader(token),
        params: {
          filterType: AnalyticsType.ORDERS_CREATED_LAST_X_DAYS,
          filterValue: numberOfDays
        }
      })
    );
  }

  getCountCompanyOrdersByDateGroupByStatus(companyId: number, date: Date): Promise<ResponseGetAnalytics> {
    const url = `${environment.apiBasepath}/analytics/company/${companyId}`;
    const token = this.cookieSrv.getCookie(COOKIE_TOKEN);

    return firstValueFrom(
      this.http.get<ResponseGetAnalytics>(url, {
        headers: getAuthorizationHeader(token),
        params: {
          filterType: AnalyticsType.TOTAL_COUNT_ORDERS_STATUS_IN_X_DAY,
          filterValue: this.dateSrv.getDateStrFormated(date)
        }
      })
    );
  }
}
