import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

import { PageService } from '../../page.service';
import { SettingsService } from '../../settings.service';
import { StateService } from '../../state.service';

import { Page } from '../page';
import { Section } from '../section';
import { StructureComponentBase } from '../structureComponentBase.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent extends StructureComponentBase implements OnInit {
  page: Page;
  urlParamPath: string;

  constructor(
    public settings: SettingsService,
    public state: StateService,
    public pageService: PageService,
    private route: ActivatedRoute,
    private router: Router) {
    super();
  }

  ngOnInit(): void {
    // When the current route changes (page load)
    this.route.params.subscribe((params) => {
      this.urlParamPath = this.route.snapshot.paramMap.get('path');
      // console.log('this.urlParamPath: ', this.urlParamPath);

      if (this.urlParamPath == 'temporary-id' && ! this.pageService.pages) {
        this.pageService.addPage();
      }
      this.getPage(this.urlParamPath);
    });

    // When the pages are first fetched
    document.addEventListener('pagesFetched', (event) => {
      // If there are saved pages
      if (this.pageService.pages.length) {
        // If the URL is for a valid page, navigate to it
        const fetchedPage: Page = this.getPage(this.urlParamPath);
        if (! fetchedPage) {
          // console.log('this.route.snapshot: ', this.route.snapshot);
          if (this.route.snapshot.routeConfig.path == "") {
            this.pageService.navigateToFirstPage();
          }
          else {
            // Redirect to Not Found page
            this.router.navigate(['**']);
          }
        }
      }
      else {
        // Show a blank page ready for adding text
        this.page = this.pageService.provideNewPage();
      }
    }, false);
  }

  getPage(path: string): Page {
    const fetchedPage: Page = this.pageService.getPageByPath(path);
    // console.log('fetchedPage: ', fetchedPage);
    if (fetchedPage) {
      this.page = fetchedPage;
      return fetchedPage;
    }
    else {
      return null;
    }
  }

  savePage(): Observable<Page> {
    if (! this.state.inDemoMode) {
      return this.pageService.savePage(null, 'patch', 0);
    }
    else {
      return null;
    }
  }

  addSection(): void {
    const newSection = {
      colourStyle: 'default',
      groups: [{
        blocks: [{
          type: 'text',
          content: ''
        }]
      }]
    };
    this.page.sections.push(newSection);
  }

  removeSection(section: Section): void {
    let currentPos: number = this.page.sections.indexOf(section);
    this.page.sections.splice(currentPos, 1);
  }

  moveSectionUp(section: Section): void {
    let currentPos: number = this.page.sections.indexOf(section);
    if (currentPos <= 0) return null;
    this.page.sections.splice(currentPos - 1, 0, this.page.sections.splice(currentPos, 1)[0]);
  }

  moveSectionDown(section: Section) {
    let currentPos: number = this.page.sections.indexOf(section);
    // No check needed for last section
    this.page.sections.splice(currentPos + 1, 0, this.page.sections.splice(currentPos, 1)[0]);
  }
}
