import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersListComponent } from './components/orders-list/orders-list.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { SharedModule } from '../shared/shared-module.module';
import { OrderService } from './services/order.service';
import { FormatCodeOrderPipe } from './pipes/format-code-order.pipe';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { ConsultOrderComponent } from './components/consult-order/consult-order.component';
import { CustomOrderPaginator } from 'src/app/utils';
@NgModule({
  declarations: [OrdersListComponent, OrderCardComponent, FormatCodeOrderPipe, ConsultOrderComponent],
  imports: [CommonModule, SharedModule],
  providers: [
    OrderService,
    {
      provide: MatPaginatorIntl,
      useValue: CustomOrderPaginator()
    }
  ],
  exports: [OrdersListComponent, OrderCardComponent, FormatCodeOrderPipe, ConsultOrderComponent]
})
export class OrdersSharedModule {}
