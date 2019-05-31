import { Component, OnInit } from '@angular/core';

import { PageService } from '../page.service';

import { Page } from '../page';

@Component({
  selector: 'app-pages-list',
  templateUrl: './pages-list.component.html',
  styleUrls: ['./pages-list.component.scss']
})
export class PagesListComponent implements OnInit {
  pages: Page[];

  constructor(public pageService: PageService) { }

  ngOnInit() {
    this.pages = this.pageService.getPages();
  }

}
