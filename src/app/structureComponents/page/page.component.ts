import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  urlParamId: string;

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
      this.urlParamId = this.route.snapshot.paramMap.get('id');
      // console.log('this.urlParamId: ', this.urlParamId);
      this.getPage(this.urlParamId);
    });

    // When the pages are first fetched
    document.addEventListener('pagesFetched', (event) => {
      // If there are saved pages
      if (this.pageService.pages.length) {
        // If the URL is for a valid page, navigate to it
        var fetchedPage = this.getPage(this.urlParamId);
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

  getPage(id: string): Page {
    var fetchedPage = this.pageService.getPage(id);
    // console.log('fetchedPage: ', fetchedPage);
    if (fetchedPage) {
      this.page = fetchedPage;
      return fetchedPage;
    }
    else {
      return null;
    }
  }

  savePage(): void {
    this.pageService.savePage(null, 'patch', 0);
  }

  addSection(): void {
    var newSection = {
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
    var currentPos = this.page.sections.indexOf(section);
    this.page.sections.splice(currentPos, 1);
  }

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
