import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTER_PAGES_PARTS } from 'src/app/constants';
import { AdminAuthGuard } from 'src/app/modules/shared/guards/admin-auth.guard';
import { AdminComponent } from './admin.component';
import { NewEditOrderComponent } from './components/new-edit-order/new-edit-order.component';
import { MyHomeAdminComponent } from './components/my-home-admin/my-home-admin.component';
import { OrdersCompanyComponent } from './components/orders-company/orders-company.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: '',
        component: MyHomeAdminComponent
      },
      {
        path: ROUTER_PAGES_PARTS.HOME_ADMIN,
        component: OrdersCompanyComponent
      },
      {
        path: `${ROUTER_PAGES_PARTS.HOME_ADMIN}/${ROUTER_PAGES_PARTS.NEW_COMPANY_ORDER}`,
        component: NewEditOrderComponent
      },
      {
        path: `${ROUTER_PAGES_PARTS.HOME_ADMIN}/${ROUTER_PAGES_PARTS.NEW_COMPANY_ORDER}/:${ROUTER_PAGES_PARTS.NEW_COMPANY_ORDER_CODE_ID}`,
        component: NewEditOrderComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
