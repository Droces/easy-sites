import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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
  title: string = 'easy-sites';
  tabSelected: string = 'pages';

  modeChangedEvent: Event = new Event('modeChanged');
  userMenuOpen: boolean = false;

  constructor(
    public settings: SettingsService,
    public state: StateService,
    public httpService: HttpService,
    public pageService: PageService,
    private router: Router) {}

  ngOnInit(): void {
    this.settings.retrieveSettings();

    if (! this.settings.backendBaseUrl && ! this.state.inDemoMode) {
      this.router.navigate(['settings']); // Redirect
      return;
    }
    if (! this.state.inDemoMode) {
      this.httpService.authenticate()
        .subscribe(data => {
          this.pageService.fetchPages();
          this.httpService.fetchCurrentUserId();
        });
    }
    else {
      this.settings.siteName = 'Demo site';
    }
  }

  exportData(): void {
    alert(JSON.stringify(this.pageService.getPages()));
  }

  changeMode(mode: string): void {
    this.state.mode = mode;
    document.dispatchEvent(this.modeChangedEvent);
  }

  openTab(tab: string): void {
    this.tabSelected = tab;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = this.userMenuOpen ? false : true;
  }

  logout(): void {
    const logoutRequest: Observable<Object> = this.httpService.logout();
    logoutRequest.subscribe(() => {
      this.state.userName = '';
      this.state.userId = '';
      this.state.userRoles = [];
    });
  }
}
