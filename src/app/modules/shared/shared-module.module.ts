import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NotificationComponent } from './components/notification/notification.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { VerticalBarChartComponent } from './components/vertical-bar-chart/vertical-bar-chart.component';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AdvancedPieChartComponent } from './components/advanced-pie-chart/advanced-pie-chart.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UrlPipe } from './pipes/url.pipe';

@NgModule({
  declarations: [
    SpinnerComponent,
    HeaderComponent,
    FooterComponent,
    NumberOnlyDirective,
    ConfirmDialogComponent,
    NotificationComponent,
    VerticalBarChartComponent,
    SanitizeHtmlPipe,
    AdvancedPieChartComponent,
    UrlPipe
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    NgxChartsModule,
    NgxChartsModule,
    FlexLayoutModule
  ],
  providers: [],
  exports: [
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    SpinnerComponent,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatAutocompleteModule,
    NumberOnlyDirective,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    ConfirmDialogComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    NotificationComponent,
    MatPaginatorModule,
    VerticalBarChartComponent,
    SanitizeHtmlPipe,
    MatChipsModule,
    MatButtonToggleModule,
    AdvancedPieChartComponent,
    MatTabsModule,
    FlexLayoutModule,
    UrlPipe
  ]
})
export class SharedModule {}
