import { Injectable } from '@angular/core';
import moment from 'moment';

const FORMAT = 'D/M/YYYY';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  constructor() {}

  public getDateStrFormated(date: Date): string {
    return moment(date).format(FORMAT);
  }

  public getDateStrDdMm(date: Date): string {
    return moment(date).format('DD/MM');
  }

  public getDate(dateStr: string): Date {
    return moment(dateStr, FORMAT).toDate();
  }

  public isValidDate(dateStr: string): boolean {
    return moment(dateStr, FORMAT, true).isValid();
  }

  public isValidDateRange(startDateStr: string, endDateStr: string): boolean {
    return this.getDate(startDateStr).getTime() <= this.getDate(endDateStr).getTime();
  }
}
