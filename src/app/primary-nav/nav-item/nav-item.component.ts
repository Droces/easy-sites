import { Component, OnInit, Input } from '@angular/core';

import { Page } from '../../structureComponents/page';

import { PageService } from '../../page.service';

@Component({
  selector: 'nav-item, [nav-item]',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent implements OnInit {
  @Input() page: Page;

  constructor(public pageService: PageService) { }

  ngOnInit() {
  }

}
