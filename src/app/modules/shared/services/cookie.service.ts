import { Injectable } from '@angular/core';
import { CookieService as CookieNgxService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  constructor(private cookiesNgxSrv: CookieNgxService) {}

  public setCookie(name: string, value: string): void {
    this.cookiesNgxSrv.set(name, value, 30);
  }

  public getCookie(name: string): string {
    return this.cookiesNgxSrv.get(name);
  }

  public deleteCookie(name: string): void {
    this.cookiesNgxSrv.delete(name);
  }
}
