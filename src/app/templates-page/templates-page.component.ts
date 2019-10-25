import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpService } from '../http.service';
import { PageService } from '../page.service';

import { Page } from '../structureComponents/page';

import { template } from '../templates/agenda';
import { templates } from './templates';

@Component({
  selector: 'app-templates-page',
  templateUrl: './templates-page.component.html',
  styleUrls: ['./templates-page.component.scss']
})
export class TemplatesPageComponent implements OnInit {
  templates;

  constructor(
    public httpService: HttpService,
    public pageService: PageService) {
    this.templates = templates;
  }

  ngOnInit() {}

  addPage(): void {
    const page: Page = this.pageService.provideNewPage();
    page.sections = template.sections;
    this.pageService.addPage(page);
  }

}
