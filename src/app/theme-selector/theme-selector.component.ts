import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

import { SettingsService } from '../settings.service';
import { StateService } from '../state.service';

import { FONTS } from '../fonts';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss']
})
export class ThemeSelectorComponent implements OnInit {
  gf = 'https://fonts.googleapis.com/css';
  fonts;

  constructor(
    public settings: SettingsService,
    public state: StateService,
    public meta: Meta) { }

  ngOnInit() {
    this.fonts = FONTS;
    this.meta.addTag({ name: 'link', content: this.gf + FONTS.roboto.url, id: 'roboto', rel: 'stylesheet' });
  }

  changeTheme(colourName: string): void {
    this.settings.themeActiveColour = colourName;
  }

  changeFont(fontId: string): void {
    this.state.font = FONTS[fontId];
  }
}
