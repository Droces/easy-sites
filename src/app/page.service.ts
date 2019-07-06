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
    this.httpService.instance.deletePage(page);
  }

  fetchPages(): Observable<Object> {
    this.pages = [];

    var request = this.httpService.instance.fetchPages();
    // Parameters are functions: next(), error(), finished().
    request.subscribe(
      (page: any) => {
        // Store returned pages
        this.pages.push(page);
      },
      () => {}, // @todo handle error
      () => {
        document.dispatchEvent(this.pagesFetchedEvent);
      }
    );

    return request;
  }

  addPage(): Page {
    var page: Page = this.provideNewPage();
    this.pages.push(page);
    this.savePage(page, 'post');
    this.router.navigate(['page/' + page.id]);
    return page;
  }

  savePage(page: Page = null, method: string = 'patch', delay: number = 3): Observable<Page> {
    clearTimeout(this.saveTimeout);
    var request: Observable<Page>;

    // If a page hasn't been provided, use the current page
    if (method == 'patch' && ! page) {
      page = this.currentPage;
    }

    if (! this.settings.backendSessionToken) {
      document.addEventListener('tokenFetched', () => {
        this.savePage(page, method);
      });
      return null;
    }

    if (method == 'patch') {
      request = this.httpService.instance.updatePage(page);
      // Call save method after at least 3 seconds
      this.saveTimeout = setTimeout(() => {
        this.performSavePage(request, method, page);
      }, delay * 1000);
    }
    else { // method == 'post'
      request = this.httpService.instance.createPage(page);
      this.performSavePage(request, method, page);
    }

    return request;
  }

  performSavePage(request: Observable<Page>, method: string, page: Page) {
    this.httpService.currentState = 'Saving';
    // Parameters are functions: next(), error(), finished().
    request.subscribe(
      (pageReturned: any) => {
        if (method == 'post') {
          // Store returned page
          page.id = pageReturned.id;
          this.router.navigate(['page/' + pageReturned.id]);
        }
      },
      () => {},
      () => {
        this.httpService.currentState = 'Saved';
      }
    );
  }

  navigateToFirstPage(): void {
    this.router.navigate(['page/' + this.pages[0].id]);
  }
}
