import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { PageService } from '../page.service';
import { SettingsService } from '../settings.service';

import { Page } from '../page';
import { Section } from '../section';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  page: Page;
  urlParamId: string;

  constructor(
    public settings: SettingsService,
    public pageService: PageService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.urlParamId = this.route.snapshot.paramMap.get('id');
      // console.log('this.urlParamId: ', this.urlParamId);
      this.getPage(this.urlParamId);
    });

    document.addEventListener('pagesFetched', (event) => {
      // If there are saved pages
      if (this.pageService.pages.length) {
        var fetchedPage = this.getPage(this.urlParamId);
        if (! fetchedPage) {
          // Redirect to Not Found page
          this.router.navigate(['**']);
        }
      }
      else {
        // Show a blank page ready for adding text
        this.page = this.pageService.provideNewPage();
      }
    }, false);

    this.page = {
      id: '',
      title: 'Loading pages...',
      sections: []
    };
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

  addSection(): void {
    this.page.sections.push({colourStyle: 'default', groups: []});
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
