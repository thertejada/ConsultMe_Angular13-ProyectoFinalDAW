import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTER_PAGES_PARTS } from './constants';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/initial/initial.module').then((m) => m.InitialModule)
  },
  {
    path: ROUTER_PAGES_PARTS.ADMIN,
    loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: ROUTER_PAGES_PARTS.HOME_USER,
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
