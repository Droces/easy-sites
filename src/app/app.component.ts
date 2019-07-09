import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SettingsService } from './settings.service';
import { StateService } from './state.service';
import { HttpService } from './http.service';
import { PageService } from './page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'easy-sites';

  modeChangedEvent = new Event('modeChanged');

  constructor(
    public settings: SettingsService,
    public state: StateService,
    public httpService: HttpService,
    public pageService: PageService,
    private router: Router) {}

  ngOnInit(): void {
    this.settings.retrieveSettings();
    if (! this.settings.backendBaseUrl) {
      this.router.navigate(['settings']); // Redirect
      return;
    }
    this.httpService.authenticate()
      .subscribe(data => {
        this.pageService.fetchPages();
        this.httpService.fetchCurrentUserId();
      });
  }

  exportData(): void {
    alert(JSON.stringify(this.pageService.getPages()));
  }

  changeMode(mode: string): void {
    this.state.mode = mode;
    document.dispatchEvent(this.modeChangedEvent);
  }
}
