import { Component, OnInit, Input } from '@angular/core';

import { Page } from '../../structureComponents/page';

import { PageService } from '../../page.service';

@Component({
  selector: 'pages-list-item, [pages-list-item]',
  templateUrl: './pages-list-item.component.html',
  styleUrls: ['./pages-list-item.component.scss']
})
export class PagesListItemComponent implements OnInit {
  @Input() page: Page;

  constructor(public pageService: PageService) { }

  ngOnInit() {
  }

  up(page: Page): void {
    let currentPos: number = this.pageService.pages.indexOf(page);
    if (currentPos <= 0) return null;
    this.pageService.pages.splice(currentPos - 1, 0, this.pageService.pages.splice(currentPos, 1)[0]);
  }
  down(page: Page): void {
    let currentPos: number = this.pageService.pages.indexOf(page);
    // No check needed for last section
    this.pageService.pages.splice(currentPos + 1, 0, this.pageService.pages.splice(currentPos, 1)[0]);
  }

  toggleMenu(page: Page): void {
    page.state.isListMenuOpen = page.state.isListMenuOpen ? false : true;
  }

}
