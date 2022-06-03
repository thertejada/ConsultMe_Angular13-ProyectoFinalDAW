import { Injectable } from '@angular/core';
import literals from 'src/assets/literals/es-ES/generic.literal.json';
import { OrderStatus } from 'src/app/models';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StringService {
  constructor() {}

  public getLiteral(...keys: Array<string>): any {
    return (
      keys.reduce((acc: any, key: string) => {
        if (acc && key) {
          return acc?.[key];
        }
      }, literals) ?? ''
    );
  }

  public getOrderStatusKeyLiteral(): Array<KeyValue<string, string>> {
    return Object.values(OrderStatus).map((value: string) => ({ key: value, value: this.getLiteral('orderStatus', value) }));
  }

  public trimAll(str: string) {
    return str?.replace(/\s/g, '');
  }
}
