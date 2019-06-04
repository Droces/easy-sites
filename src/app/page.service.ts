import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Page } from './page';

import { SettingsService } from './settings.service';
import { HttpService } from './http.service';

import { PAGES } from './mock-pages';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  pages: Page[];
  currentPage: Page;
  pageIdCounter: number;
  saveTimeout;

  constructor(
    private route: ActivatedRoute,
    public settings: SettingsService,
    public httpService: HttpService,
    private http: HttpClient) {

    this.pages = PAGES;
    this.pageIdCounter = 4;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +this.route.snapshot.paramMap.get('id');
      this.getPage(id);
    });

    // this.fetchPage(this.page.be_id).subscribe((data) => {
    //   console.log('this.pageFetched: ', this.pageFetched);
    // });
  }

  getPages(): Page[] {
    return this.pages;
  }

  getPage(id: number): Page {
    for (let page of this.pages) {
      if (page.id == id) {
        this.currentPage = page;
        return page;
      }
    }
    return null;
  }

  addPage(): number {
    this.pageIdCounter ++;
    var newPage: Page = {
      id: this.pageIdCounter,
      be_id: '',
      title: 'New page',
      sections: []};

    this.pages.push(newPage);
    this.savePage(newPage, 'post');
    return this.pageIdCounter;
  }

  removePage(page): void {
    var index = this.pages.indexOf(page);
    if (index > -1) {
      this.pages.splice(index, 1);
    }
  }

  fetchPage(be_id: string) {
    var url = this.settings.backend_page_get_url;
    url = url.replace('[id]', be_id);
    return this.http.get(url);
  }

  savePage(page: Page = null, method: string = 'patch') {
    clearTimeout(this.saveTimeout);

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
      this.doSavePage(page, method).subscribe((data) => {
        data = JSON.parse(data).data;
        this.httpService.currentState = 'Saved';
        if (method == 'post') {
          page.be_id = data.id;
        }

      });
    },3000);
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
      payload.data['id'] = page.be_id;
      url = this.settings.backend_page_patch_url;
      url = url.replace('[id]', page.be_id);
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
