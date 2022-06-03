import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitialRoutingModule } from './initial-routing.module';
import { InitialComponent } from './initial.component';
import { SharedModule } from 'src/app/modules/shared/shared-module.module';
import { OrdersSharedModule } from 'src/app/modules/orders/orders-shared.module';
import { UserSharedModule } from 'src/app/modules/users/user-shared.module';

@NgModule({
  declarations: [InitialComponent],
  imports: [CommonModule, InitialRoutingModule, SharedModule, OrdersSharedModule, UserSharedModule]
})
export class InitialModule {}
