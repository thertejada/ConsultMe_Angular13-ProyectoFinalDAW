import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from 'src/app/modules/shared/shared-module.module';
import { MyHomeAdminComponent } from './components/my-home-admin/my-home-admin.component';
import { OrdersSharedModule } from 'src/app/modules/orders/orders-shared.module';
import { NewEditOrderComponent } from './components/new-edit-order/new-edit-order.component';
import { OrdersCompanyComponent } from './components/orders-company/orders-company.component';

@NgModule({
  declarations: [AdminComponent, MyHomeAdminComponent, NewEditOrderComponent, OrdersCompanyComponent],
  imports: [CommonModule, AdminRoutingModule, SharedModule, OrdersSharedModule]
})
export class AdminModule {}
