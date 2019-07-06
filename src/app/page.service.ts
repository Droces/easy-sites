import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Page } from './structureComponents/page';

import { SettingsService } from './settings.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  pages: Page[];
  currentPage: Page;
  saveTimeout;

  pagesFetchedEvent = new Event('pagesFetched');

  constructor(
    private router: Router,
    public settings: SettingsService,
    public httpService: HttpService) {
  }

  ngOnInit(): void {
  }

  getPages(): Page[] {
    return this.pages;
  }

  getPage(id: string): Page {
    if (typeof this.pages == 'undefined' || this.pages == []) {
      return null;
    }
    // console.log('this.pages: ', this.pages);
    for (let page of this.pages) {
      if (page.id == id) {
        this.currentPage = page;
        return page;
      }
    }
    // console.log('Page not found');
    return null;
  }

  addPage(): Page {
    var newPage: Page = this.provideNewPage();
    this.pages.push(newPage);
    return newPage;
  }

  provideNewPage(): Page {
    return {
      id: 'temporary-id',
      title: 'New page...',
      sections: [{
        colourStyle: 'default',
        groups: [{
          blocks: [{
            type: 'text'
          }]
        }]
      }]
    };
  }

  removePage(page: Page): void {
    var index = this.pages.indexOf(page);
    if (index > -1) {
      this.pages.splice(index, 1);
    }

    var url: string = this.settings.backendBaseUrl + this.httpService.instance.backendPageDeletePath;
    url = url.replace('[id]', page.id);
    this.httpService.instance.deletePage(url);
  }

  fetchPages(): Observable<Object> {
    this.pages = [];

    var request = this.httpService.instance.fetchPages();
    // Store returned pages
    // Parameters are functions: next(), error(), finished().
    request.subscribe(
      (page: any) => {
        this.pages.push(page);
      },
      () => {},
      () => {
        document.dispatchEvent(this.pagesFetchedEvent);
      }
    );

    return request;
  }

  savePage(page: Page = null, method: string = 'patch', delay: number = 3): Observable<Object> {
    clearTimeout(this.saveTimeout);
    var request: Observable<Object>;

    if (method == 'patch' && ! page) {
      page = this.currentPage;
    }

    if (! this.settings.backendSessionToken) {
      document.addEventListener('tokenFetched', () => {
        this.savePage(page, method);
      });
      return null;
    }

    request = this.doSavePage(page, method);
    // Call save method after at least 3 seconds
    this.saveTimeout = setTimeout(() => {
      this.httpService.currentState = 'Saving';
      request.subscribe(data => {
        // console.log('data: ', data);
        this.httpService.currentState = 'Saved';
        if (method == 'post') {
          page.id = data.id;
          this.router.navigate(['page/' + data.id]);
        }
      });

    }, delay * 1000);
    return request;
  }


  doSavePage(page: Page, method: string): Observable<Object> {
    var payload = {
      data: {
        type: "node--page",
        attributes: {
          title: page.title,
          body: JSON.stringify(page.sections)
        }
      }
    };

    var url: string;
    if (method == 'patch') {
      payload.data['id'] = page.id;
      url = this.settings.backendBaseUrl + this.httpService.instance.backendPagePatchPath;
      url = url.replace('[id]', page.id);
    }
    else if (method == 'post') {
      url = this.settings.backendBaseUrl + this.httpService.instance.backendPagePostPath;
    }

    if (method == 'patch') {
      return this.httpService.instance.updatePage(url, payload);
    }
    else { // method == 'post'
      return this.httpService.instance.createPage(url, payload);
    }
  }

  navigateToFirstPage(): void {
    this.router.navigate(['page/' + this.pages[0].id]);
  }
}
