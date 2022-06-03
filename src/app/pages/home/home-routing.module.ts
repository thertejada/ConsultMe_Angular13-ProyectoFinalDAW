import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTER_PAGES_PARTS } from 'src/app/constants';
import { UserAuthGuard } from 'src/app/modules/shared/guards/user-auth.guard';
import { CheckOrderComponent } from './components/check-order/check-order.component';
import { MyHomeComponent } from './components/my-home/my-home.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [UserAuthGuard],
    children: [
      { path: '', component: MyHomeComponent },
      { path: ROUTER_PAGES_PARTS.CHECK, component: CheckOrderComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
