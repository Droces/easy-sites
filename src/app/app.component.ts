import { Component } from '@angular/core';

import { PagesListComponent } from './pages-list/pages-list.component';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';

import { SettingsService } from './settings.service';
import { HttpService } from './http.service';
import { PageService } from './page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'easy-sites';

  constructor(public settings: SettingsService,
    public httpService: HttpService,
    public pageService: PageService) {}

  exportData(): void {
    alert(JSON.stringify(this.pageService.getPages()));
  }
}
