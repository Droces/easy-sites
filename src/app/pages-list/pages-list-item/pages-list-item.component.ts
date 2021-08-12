import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Page } from '../../structureComponents/page';

import { PageService } from '../../page.service';

@Component({
  selector: 'pages-list-item, [pages-list-item]',
  templateUrl: './pages-list-item.component.html',
  styleUrls: ['./pages-list-item.component.scss']
})
export class PagesListItemComponent implements OnInit {
  @Input() page: Page;

  @Output() removed = new EventEmitter<Page>();

  constructor(public pageService: PageService) { }

  ngOnInit() {
  }

  up(): void {
    let currentPos: number = this.pageService.pages.indexOf(this.page);
    if (currentPos <= 0) return null;
    this.pageService.pages.splice(currentPos - 1, 0, this.pageService.pages.splice(currentPos, 1)[0]);
  }
  down(): void {
    let currentPos: number = this.pageService.pages.indexOf(this.page);
    // No check needed for last section
    this.pageService.pages.splice(currentPos + 1, 0, this.pageService.pages.splice(currentPos, 1)[0]);
  }

  toggleMenu(): void {
    this.page.state.isListMenuOpen = this.page.state.isListMenuOpen ? false : true;
  }

  remove(page: Page = this.page): void {
    this.removed.emit(page);
  }

}
