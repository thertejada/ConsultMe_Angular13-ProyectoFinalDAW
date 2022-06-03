import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRegistarComponent } from './components/login-register/login-register.component';
import { SharedModule } from '../shared/shared-module.module';

@NgModule({
  declarations: [LoginRegistarComponent],
  imports: [CommonModule, SharedModule],
  providers: [],
  exports: [LoginRegistarComponent]
})
export class UserSharedModule {}
