import { Injectable } from '@angular/core';

import { Page } from './page';

import { PAGES } from './mock-pages';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  pages: Page[];
  pageIdCounter: number;

  constructor() {
    this.pages = PAGES;
    this.pageIdCounter = 4;
  }

  // getPage(): Page {}

  getPages(): Page[] {
    return this.pages;
  }

  getPage(id: number): Page {
    for (let page of this.pages) {
      if (page.id == id) {
        return page;
      }
    }
    return null;
  }

  addPage(): void {
    this.pageIdCounter ++;
    this.pages.push({id: this.pageIdCounter, title: 'New page', sections: []});
  }
}
