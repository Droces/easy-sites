import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { PageService } from '../page.service';
import { StateService } from '../state.service';

import { Page } from '../structureComponents/page';

@Component({
  selector: 'app-pages-list',
  templateUrl: './pages-list.component.html',
  styleUrls: ['./pages-list.component.scss']
})
export class PagesListComponent implements OnInit {

  constructor(
    public pageService: PageService,
    public state: StateService,
    private router: Router) { }

  ngOnInit() {
    /* This subscription will fire when the route changes */
    this.router.events.subscribe(val=> {
      // console.log('val:', val);
      
      // @todo If the new route has the same path as the current route, throw exception

      /* Only react if it's the final active route */
      if (val instanceof NavigationEnd) {
      }
    });
  }

  addPage(): void {
    this.pageService.addPage();
  }

  removePage(page: Page): void {
    if (page.id == this.pageService.currentPage.id) {
      this.router.navigate(['page/' + this.pageService.pages[0].id]);
    }
    this.pageService.removePage(page);
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
