import { Component } from '@angular/core';
import { GuardsCheckEnd, GuardsCheckStart, NavigationCancel, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public loading = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof GuardsCheckStart) {
        this.loading = true;
      }
      if (event instanceof GuardsCheckEnd || event instanceof NavigationCancel) {
        this.loading = false;
      }
    });
  }
}
