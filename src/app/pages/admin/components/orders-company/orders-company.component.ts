import { Component, OnInit } from '@angular/core';
import { OrderCardMode } from 'src/app/models';

@Component({
  selector: 'app-orders-company',
  templateUrl: './orders-company.component.html',
  styleUrls: ['./orders-company.component.scss']
})
export class OrdersCompanyComponent implements OnInit {
  get CardModeEnum(): any {
    return OrderCardMode;
  }

  constructor() {}

  ngOnInit(): void {}
}
