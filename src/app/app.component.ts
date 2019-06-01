import { Component } from '@angular/core';

import { PagesListComponent } from './pages-list/pages-list.component';

import { SettingsService } from './settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'easy-sites';

  constructor(
    public settings: SettingsService) {}

  changeTheme(): void {
    this.settings.theme = this.settings.theme == "green" ? "blue" : "green";
  }
}
