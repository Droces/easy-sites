import { Component, OnInit } from '@angular/core';

import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss']
})
export class ThemeSelectorComponent implements OnInit {

  constructor(public settings: SettingsService) { }

  ngOnInit() {
  }

  changeTheme(colourName): void {
    this.settings.themeActiveColour = colourName;
  }
}
