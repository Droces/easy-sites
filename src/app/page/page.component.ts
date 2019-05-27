import { Component, OnInit } from '@angular/core';

import { PageService } from '../page.service';

import { Page } from '../page';
import { Section } from '../section';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  page: Page;
  sections: Section[];

  constructor(public pageService: PageService) { }

  ngOnInit(): void {
    this.getPage();
  }

  getPage(): void {
    this.page = this.pageService.getPages()[0];
    this.sections = this.page.sections;
  }

  addSection(): void {
    this.sections.push({ colourStyle: 'default', content: 'Section' });
  }

  removeLastSection(): void {
    this.sections.pop();
  }
}
