import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { SharedModule } from './modules/shared/shared-module.module';
import { DialogModule } from '@ngneat/dialog';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';

registerLocaleData(es);
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, SharedModule, DialogModule.forRoot(), HttpClientModule],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es-ES'
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es-ES'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
