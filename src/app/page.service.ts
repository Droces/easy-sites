import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Page } from './structureComponents/page';
import { DrupalPagesResponse } from './drupalPagesResponse';

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
    private route: ActivatedRoute,
    private router: Router,
    public settings: SettingsService,
    public httpService: HttpService,
    private http: HttpClient) {
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
            type: 'text',
            content: ''
          }]
        }]
      }]
    };
  }

  removePage(page): void {
    var index = this.pages.indexOf(page);
    if (index > -1) {
      this.pages.splice(index, 1);
    }

    var url: string = this.settings.backendBaseUrl + this.httpService.instance.backendPageDeletePath;
    url = url.replace('[id]', page.id);
    var request = this.httpService.instance.deletePage(url);
  }

  fetchPages(): Observable<Object> {
    var request = this.httpService.instance.fetchPages();

    request.subscribe((response: DrupalPagesResponse) => {
      this.pages = [];
      if (response.data.length) {
        var firstPageId: string = response.data[0].id;
        for (let page of response.data) {
          var body: string = page.attributes.body.value;
          var bodyParsed = JSON.parse(body.replace('/', ''));
          this.pages.push({
            id: page.id,
            title: page.attributes.title,
            sections: bodyParsed
          });
        }
      }
      document.dispatchEvent(this.pagesFetchedEvent);
    });

    return request;
  }

  savePage(page: Page = null, method: string = 'patch', delay: number = 3): Observable<Object> {
    clearTimeout(this.saveTimeout);
    var request;

    if (method == 'patch' && ! page) {
      page = this.currentPage;
    }

    if (! this.settings.backendSessionToken) {
      document.addEventListener('tokenFetched', (event) => {
        this.savePage(page, method);
      });
      return null;
    }

    request = this.doSavePage(page, method);
    // Call save method after at least 3 seconds
    this.saveTimeout = setTimeout(() => {

      this.httpService.currentState = 'Saving';
      request.subscribe(data => {
        if (typeof data == 'string') {
          var dataObj = JSON.parse(data).data;
          this.httpService.currentState = 'Saved';
          if (method == 'post') {
            page.id = dataObj.id;
            this.router.navigate(['page/' + dataObj.id]);
          }
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
