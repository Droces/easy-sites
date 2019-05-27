import { Injectable } from '@angular/core';

import { Page } from './page';

import { PAGES } from './mock-pages';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor() { }

  // getPage(): Page {}

  getPages(): Page[] {
    return PAGES;
  }
}
