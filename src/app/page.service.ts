import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Page } from './page';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public settings: SettingsService,
    public httpService: HttpService,
    private http: HttpClient) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = this.route.snapshot.paramMap.get('id');
      this.getPage(id);
    });

    // this.fetchPage(this.page.id).subscribe((data) => {
    //   console.log('this.pageFetched: ', this.pageFetched);
    // });
  }

  getPages(): Page[] {
    return this.pages;
  }

  getPage(id: string): Page {
    for (let page of this.pages) {
      if (page.id == id) {
        this.currentPage = page;
        return page;
      }
    }
    return null;
  }

  addPage(): string {
    var newPage: Page = {
      id: 'temporary-id',
      title: 'New page',
      sections: []};

    this.pages.push(newPage);
    this.savePage(newPage, 'post');
    return newPage.id;
  }

  removePage(page): void {
    var index = this.pages.indexOf(page);
    if (index > -1) {
      this.pages.splice(index, 1);
    }
  }

  fetchPages() {
    var url = this.settings.backend_pages_get_url;
    this.http.get(url).subscribe((response: DrupalPagesResponse) => {
      console.log('response: ', response);
      this.pages = [];
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
      this.router.navigate(['page/' + firstPageId]);
      // console.log('this.pages: ', this.pages);
    });
  }

  fetchPage(id: string) {
    var url = this.settings.backend_page_get_url;
    url = url.replace('[id]', id);
    return this.http.get(url);
  }

  savePage(page: Page = null, method: string = 'patch') {
    clearTimeout(this.saveTimeout);
    var request;

    if (! page) {
      page = this.currentPage;
    }

    if (! this.settings.backend_session_token) {
      this.httpService.fetchToken().subscribe(data => {
        // console.log('token: ', data);
        this.httpService.saveToken(data);
      });
    }

    this.saveTimeout = setTimeout(() => {
      this.httpService.currentState = 'Saving';
      request = this.doSavePage(page, method).subscribe(data => {
        if (typeof data == 'string') {
          var dataObj = JSON.parse(data).data;
          this.httpService.currentState = 'Saved';
          if (method == 'post') {
            page.id = dataObj.id;
          }
        }
      },
      error => {
        this.httpService.handleError(error);
      });
    },3000);
    return request;
  }


  doSavePage(page: Page, method: string) {
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
      url = this.settings.backend_page_patch_url;
      url = url.replace('[id]', page.id);
    }
    else if (method == 'post') {
      url = this.settings.backend_page_post_url;
    }

    // console.log('this.httpOptions: ', this.httpOptions);
    if (method == 'patch') {
      return this.http.patch(url, payload, this.httpService.httpOptions);
    }
    else if (method == 'post') {
      return this.http.post(url, payload, this.httpService.httpOptions);
    }
  }
}
