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
    var fields = ['siteName', 'backendBaseUrl', 'backendCms'];
    if (! fields.includes(field))
      return null;
    localStorage.setItem(field, value);
  }

  changeCMS(backend: string) {
    localStorage.setItem('backendCms', backend);
  }

  fetchPages() {
      // this.httpService.authenticate();
      // this.httpService.fetchCurrentUserId();
      this.pageService.fetchPages();
  }
}
