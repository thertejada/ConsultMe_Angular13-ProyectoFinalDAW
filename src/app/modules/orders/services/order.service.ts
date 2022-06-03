import { Injectable } from '@angular/core';
import { Order, OrderStatus, ResponseGetOrder, ResponseGetOrders, ResponseSusscess } from 'src/app/models';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { getAuthorizationHeader } from 'src/app/utils';
import { CookieService } from '../../shared/services/cookie.service';
import { COOKIE_TOKEN } from 'src/app/constants';
import { DateService } from '../../shared/services/date.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient, private cookieSrv: CookieService, private dateSrv: DateService) {}

  public getOrders(
    filters: { status?: OrderStatus; startDate?: string; endDate?: string; orderCode?: string },
    userId: number,
    companyId: number,
    limit: number,
    offset: number
  ): Promise<ResponseGetOrders> {
    return new Promise(async (resolve, reject) => {
      const url = `${environment.apiBasepath}/orders`;
      const token = this.cookieSrv.getCookie(COOKIE_TOKEN);

      const params: { [key: string]: any } = {};
      if (filters?.status) {
        params['status'] = filters.status;
      }
      if (filters?.startDate) {
        params['startDate'] = filters.startDate;
      }
      if (filters?.endDate) {
        params['endDate'] = filters.endDate;
      }
      if (filters?.orderCode) {
        params['code'] = filters.orderCode;
      }
      if (userId) {
        params['userId'] = userId;
      }
      if (companyId) {
        params['companyId'] = companyId;
      }
      if (limit) {
        params['limit'] = limit;
      }
      if (offset) {
        params['offset'] = offset;
      }

      await firstValueFrom(
        this.http.get<ResponseGetOrders>(url, {
          headers: getAuthorizationHeader(token),
          params: params
        })
      )
        .then((res: ResponseGetOrders) =>
          resolve({
            ...res,
            data: {
              ...res?.data,
              orders: res?.data?.orders?.map((order: Order) => this.mapOrder(order))
            }
          })
        )
        .catch((err) => reject(err));
    });
  }

  public getOrderByCode(orderCode: string): Promise<ResponseGetOrder> {
    return new Promise(async (resolve, reject) => {
      const url = `${environment.apiBasepath}/orders/code/${orderCode}`;
      const token = this.cookieSrv.getCookie(COOKIE_TOKEN);

      await firstValueFrom(
        this.http.get<ResponseGetOrder>(url, {
          headers: getAuthorizationHeader(token)
        })
      )
        .then((res: ResponseGetOrder) =>
          resolve({
            ...res,
            data: this.mapOrder(res?.data)
          })
        )
        .catch((err) => reject(err));
    });
  }

  public addOrderToMyList(orderId: number, userId: number): Promise<ResponseSusscess> {
    const url = `${environment.apiBasepath}/users/order`;
    const token = this.cookieSrv.getCookie(COOKIE_TOKEN);

    return firstValueFrom(
      this.http.post<ResponseSusscess>(
        url,
        {
          userId: userId,
          orderId: orderId
        },
        {
          headers: getAuthorizationHeader(token)
        }
      )
    );
  }

  public removeOrderToMyList(orderId: number, userId: number): Promise<ResponseSusscess> {
    const url = `${environment.apiBasepath}/users/order`;
    const token = this.cookieSrv.getCookie(COOKIE_TOKEN);

    return firstValueFrom(
      this.http.delete<ResponseSusscess>(url, {
        headers: getAuthorizationHeader(token),
        body: {
          userId: userId,
          orderId: orderId
        }
      })
    );
  }

  public addOrder(order: Order): Promise<ResponseSusscess> {
    const url = `${environment.apiBasepath}/orders`;
    const token = this.cookieSrv.getCookie(COOKIE_TOKEN);

    return firstValueFrom(
      this.http.post<ResponseSusscess>(
        url,
        { ...order, date: this.dateSrv.getDateStrFormated(order.date) },
        {
          headers: getAuthorizationHeader(token)
        }
      )
    );
  }

  public updateOrder(order: Order): Promise<ResponseSusscess> {
    const url = `${environment.apiBasepath}/orders`;
    const token = this.cookieSrv.getCookie(COOKIE_TOKEN);

    return firstValueFrom(
      this.http.put<ResponseSusscess>(
        url,
        { ...order, date: this.dateSrv.getDateStrFormated(order.date) },
        {
          headers: getAuthorizationHeader(token)
        }
      )
    );
  }

  private mapOrder(order: Order): Order {
    return order && Object.keys(order)?.length > 0
      ? { ...order, date: order?.date && typeof order.date === 'string' ? this.dateSrv.getDate(order.date) : order?.date }
      : order;
  }
}
