import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { OrdersSharedModule } from 'src/app/modules/orders/orders-shared.module';
import { SharedModule } from 'src/app/modules/shared/shared-module.module';
import { CheckOrderComponent } from './components/check-order/check-order.component';
import { MyHomeComponent } from './components/my-home/my-home.component';

@NgModule({
  declarations: [HomeComponent, CheckOrderComponent, MyHomeComponent],
  imports: [CommonModule, HomeRoutingModule, OrdersSharedModule, SharedModule]
})
export class HomeModule {}
