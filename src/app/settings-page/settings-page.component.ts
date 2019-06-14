import { Component, OnInit } from '@angular/core';

import { SettingsService } from '../settings.service';
import { HttpService } from '../http.service';
import { PageService } from '../page.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {

  constructor(
    public settings: SettingsService,
    public httpService: HttpService,
    public pageService: PageService) { }

  ngOnInit() {
  }

  storeSetting(field: string, value: string) {
    // console.log('value: ', value);
    localStorage.setItem(field, value);
  }

  changeCMS() {}

  fetchPages() {
      this.httpService.fetchToken();
      this.pageService.fetchPages();
      this.httpService.fetchCurrentUserId();
  }
}
