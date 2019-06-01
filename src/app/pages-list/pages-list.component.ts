import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { PageService } from '../page.service';

import { Page } from '../page';

@Component({
  selector: 'app-pages-list',
  templateUrl: './pages-list.component.html',
  styleUrls: ['./pages-list.component.scss']
})
export class PagesListComponent implements OnInit {
  pages: Page[];
  currentPageId: number;

  constructor(
    public pageService: PageService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.pages = this.pageService.getPages();

    /* This subscription will fire when the route changes */
    this.router.events.subscribe(val=> {
      /* Only react if it's the final active route */
      if (val instanceof NavigationEnd) {
        this.getCurrentPageId(val);
      }
    });
  }

  getCurrentPageId(val): void {
    // console.log('this.router.url: ', this.router.url);
    /* Holds all params, queryParams, segments and fragments from the current (active) route */
    let currentUrlTree = this.router.parseUrl(this.router.url);
    // console.info(currentUrlTree);
    const group = currentUrlTree.root.children["primary"];
    const segments = group.segments; // returns 2 segments 'team' and '33'
    // console.log('segments: ', segments);
    if (segments.length == 2 && segments[0].path == 'page') {
      this.currentPageId = +segments[1].path;
    }
  }

  addPage(): void {
    this.pageService.addPage();
  }

  up(page): void {
    var currentPos = this.pages.indexOf(page);
    console.log('currentPos: ', currentPos);
    if (currentPos <= 0) {
      return null;
    }
    this.pages.splice(currentPos - 1, 0, this.pages.splice(currentPos, 1)[0]);
  }
  down(page): void {
    var currentPos = this.pages.indexOf(page);
    // No check needed for last section
    this.pages.splice(currentPos + 1, 0, this.pages.splice(currentPos, 1)[0]);
  }
}
