import { Injectable } from '@angular/core';
import { ResponseGetUsersSelf, ResponsePostUsersLogin, ResponsePostUsersRegister, User, UserRole } from 'src/app/models';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { getAuthorizationHeader, isKoResponse } from 'src/app/utils';
import { CookieService } from '../../shared/services/cookie.service';
import { COOKIE_TOKEN } from 'src/app/constants';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myUser$: BehaviorSubject<User>;

  constructor(private http: HttpClient, private cookieSrv: CookieService) {
    this.myUser$ = new BehaviorSubject(undefined);
  }

  private nextUser(user: User): void {
    this.myUser$.next(user);
  }

  public getMyUser$(): BehaviorSubject<User> {
    return this.myUser$;
  }

  public getMyUserValue(): User {
    return this.myUser$.getValue();
  }

  public checkExistUser(): Promise<User> {
    return new Promise(async (resolve, reject) => {
      const token = this.cookieSrv.getCookie(COOKIE_TOKEN);
      if (this.myUser$?.getValue() == null && token) {
        const url = `${environment.apiBasepath}/users/self`;

        await firstValueFrom(this.http.get<ResponseGetUsersSelf>(url, { headers: getAuthorizationHeader(token) }))
          .then((response: ResponseGetUsersSelf) => {
            if (isKoResponse(response) || !Object.values(UserRole).includes(response.data.role)) {
              reject(response.error);
            }

            this.nextUser(response.data);
            resolve(response.data);
          })
          .catch((err) => reject(err));
      } else {
        resolve(this.myUser$.getValue());
      }
    });
  }

  public login(email: string, password: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      const url = `${environment.apiBasepath}/users/login`;
      const body = {
        email,
        password
      };

      await firstValueFrom(this.http.post<ResponsePostUsersLogin>(url, body))
        .then((response: ResponsePostUsersLogin) => {
          if (
            isKoResponse(response) ||
            !response.data.user ||
            !Object.values(UserRole).includes(response.data.user?.role) ||
            !response.data.token
          ) {
            reject(response.error);
          }

          if (this.cookieSrv.getCookie(COOKIE_TOKEN) !== '') {
            this.cookieSrv.deleteCookie(COOKIE_TOKEN);
          }
          this.cookieSrv.setCookie(COOKIE_TOKEN, response.data.token);
          this.nextUser(response.data.user);
          resolve(response.data.user);
        })
        .catch((err) => reject(err));
    });
  }

  public register(email: string, password: string, name: string, surnames: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      const url = `${environment.apiBasepath}/users/register`;
      const body = {
        email,
        password,
        name,
        surnames
      };

      await firstValueFrom(this.http.post<ResponsePostUsersRegister>(url, body))
        .then((response: ResponsePostUsersRegister) => {
          if (
            isKoResponse(response) ||
            !response.data.user ||
            !Object.values(UserRole).includes(response.data.user?.role) ||
            !response.data.token
          ) {
            reject(response.error);
          }

          this.cookieSrv.setCookie(COOKIE_TOKEN, response.data.token);
          this.nextUser(response.data.user);
          resolve(response.data.user);
        })
        .catch((err) => reject(err));
    });
  }

  public logout(): void {
    this.cookieSrv.deleteCookie(COOKIE_TOKEN);
    this.nextUser(null);
  }
}
