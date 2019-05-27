import { Component, OnInit } from '@angular/core';

import { PageService } from '../page.service';

import { Section } from '../section';
import { Page } from '../page';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  sections: Section = [{ colourStyle: 'default', content: 'Section 1' }];
  // sections: Section[];

  constructor(public pageService: PageService) { }

  ngOnInit(): void {
    this.getPage();
  }

  getPage(): void {}
}
