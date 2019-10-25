import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsService } from '../settings.service';
import { HttpService } from '../http.service';
import { PageService } from '../page.service';

import { Page } from '../structureComponents/page';

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

  ngOnInit() {}

  storeSetting(field: string, value: string) {
    // console.log('value: ', value);
    const fields = ['siteName', 'backendBaseUrl', 'backendCms'];
    if (! fields.includes(field))
      return null;
    localStorage.setItem(field, value);
  }

  changeCMS(backend: string) {
    if (! ['drupal', 'wordpress'].includes(backend))
      return null;
    localStorage.setItem('backendCms', backend);
  }

  changePlugin(plugin: string) {
    if (! this.httpService.backendServices.includes(plugin))
      return null;
    // console.log('plugin: ', plugin);
    localStorage.setItem('backendPlugin', plugin);
    this.httpService.switchBackendService(plugin);
  }

  fetchPages() {
    // this.httpService.authenticate();
    // this.httpService.fetchCurrentUserId();
    let request: Observable<Page> = this.pageService.fetchPages();
    request.subscribe(data => {
      this.pageService.setFirstPageCurrent();
    });
  }
}
