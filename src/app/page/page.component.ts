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
  theme: string;

  constructor(public pageService: PageService) { }

  ngOnInit(): void {
    this.getPage();
  }

  getPage(): void {
    this.page = this.pageService.getPages()[0];
  }

  changeTheme(): void {
    this.theme = "red"
  }

  addSection(): void {
    this.page.sections.push({ id: Date.now(), colourStyle: 'default', groups: []});
  }

  removeSection(section: Section): void {
    var currentPos = this.page.sections.indexOf(section);
    this.page.sections.splice(currentPos, 1);
  }

  // removeLastSection(): void {
  //   this.page.sections.pop();
  // }

  moveSectionUp(section: Section) {
    var currentPos = this.page.sections.indexOf(section);
    if (currentPos <= 0) {
      return null;
    }
    this.page.sections.splice(currentPos - 1, 0, this.page.sections.splice(currentPos, 1)[0]);
  }

  moveSectionDown(section: Section) {
    var currentPos = this.page.sections.indexOf(section);
    // No check needed for last section
    this.page.sections.splice(currentPos + 1, 0, this.page.sections.splice(currentPos, 1)[0]);
  }
}
