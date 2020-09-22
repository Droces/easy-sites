import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Page } from './structureComponents/page';
import { TextBlock } from './structureComponents/blocks/text-block';

import { SettingsService } from './settings.service';
import { StateService } from './state.service';
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
    public state: StateService,
    public httpService: HttpService) {
  }

  ngOnInit(): void {
  }

  getPages(): Page[] {
    return this.pages;
  }

  getPageById(id: string): Page {
    if (typeof this.pages == 'undefined' || this.pages == []) {
      return null;
    }
    for (let page of this.pages) {
      if (page.id == id) {
        this.currentPage = page;
        return page;
      }
    }
    return null;
  }

  getPageByPath(path: string): Page {
    // console.log('this.pages:', this.pages);
    if (typeof this.pages == 'undefined' || this.pages == []) {
      return null;
    }
    for (let page of this.pages) {
      if (page.path == path) {
        this.currentPage = page;
        // console.log('this.currentPage:', this.currentPage);
        return page;
      }
    }
    return this.setFirstPageCurrent();
  }

  setFirstPageCurrent(): Page {
    this.currentPage = this.pages[0];
    // console.log('this.currentPage:', this.currentPage);
    return this.currentPage;
  }

  provideNewPage(title: string = null): Page {
    if (! title)
      title = 'New page...';
    let path: string = title.replace(/\W+/g, '-').toLowerCase();;
    return {
      id: 'temporary-id',
      title: title,
      path: path,
      navWeight: 0,
      sections: [{
        colourStyle: 'default',
        groups: [{
          blocks: [<TextBlock>{
            type: 'text',
            content: ''
          }]
        }]
      }],
      state: {
        isListMenuOpen: false
      }
    };
  }

  removePage(page: Page): void {
    let index: number = this.pages.indexOf(page);
    if (index > -1) {
      this.pages.splice(index, 1);
    }
    this.httpService.instance.deletePage(page);
  }

  fetchPages(): Observable<Page> {
    this.pages = [];

    const request: Observable<Page> = this.httpService.instance.fetchPages();
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

  addPage(page: Page = null): Page {
    if (typeof this.pages == 'undefined') {
      this.pages = [];
    }

    if (! page) {
      page = this.provideNewPage();
    }
    
    this.pages.push(page);
    this.currentPage = page;

    if (! this.state.inDemoMode) {
      this.savePage(page, 'post');
    }

    this.router.navigate(['page/' + page.path]);
    return page;
  }

  savePage(page: Page = null, method: string = 'patch', delay: number = 0): Observable<Page> {
    clearTimeout(this.saveTimeout);
    let request: Observable<Page>;

    // If a page hasn't been provided, use the current page
    if (method == 'patch' && ! page) {
      page = this.currentPage;
    }
    else if (! page) {
      return null;
    }

    if (! this.state.backendSessionToken) {
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
        // console.log('pageReturned', pageReturned);
        if (method == 'post') {
          // Store returned page
          page.id = pageReturned.id;
          this.router.navigate(['page/' + pageReturned.path]);
        }
      },
      () => {},
      () => {
        this.httpService.currentState = 'Saved';
      }
    );
  }

  navigateToFirstPage(): void {
    // console.log('this.pages[0]:', this.pages[0]);
    this.router.navigate(['page/' + this.pages[0].path]);
  }
}
