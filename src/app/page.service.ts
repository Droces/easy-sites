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
    this.pages.push({id: this.pageIdCounter, be_id: '', title: 'New page', sections: []});
    return this.pageIdCounter;
  }

  fetchPage(be_id: string) {
    var url = this.settings.backend_page_get_url;
    url = url.replace('[id]', be_id);
    return this.http.get(url);
  }

  savePage() {
    clearTimeout(this.saveTimeout);

    if (! this.settings.backend_session_token) {
      this.httpService.fetchToken().subscribe(data => {
        // console.log('token: ', data);
        this.httpService.saveToken(data);
      });
    }

    this.saveTimeout = setTimeout(() => {
      this.httpService.currentState = 'Saving';
      this.doSavePage(this.currentPage).subscribe((data) => {
        this.httpService.currentState = 'Saved';
      });
    },3000);
  }
  doSavePage(page) {
    var url = this.settings.backend_page_patch_url;
    url = url.replace('[id]', page.be_id);
    var payload = {
      data: {
        type: "node--page",
        id: page.be_id,
        attributes: {
          title: page.title,
          body: JSON.stringify(page.sections)
        }
      }
    };
    // console.log('this.httpOptions: ', this.httpOptions);
    return this.http.patch(url, payload, this.httpService.httpOptions);
  }
}
