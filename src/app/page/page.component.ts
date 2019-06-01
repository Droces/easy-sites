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

  constructor(
    public settings: SettingsService,
    public pageService: PageService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +this.route.snapshot.paramMap.get('id');
      this.getPage(id);
      this.settings.theme = "blue";
    });
  }

  getPage(id: number): void {
    this.page = this.pageService.getPage(id);
    if (this.page == null) {
      // Redirect to Not Found page
      this.router.navigate(['**']);
    }
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
