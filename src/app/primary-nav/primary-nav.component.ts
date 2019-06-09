import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { SettingsService } from '../settings.service';
import { PageService } from '../page.service';

import { Page } from '../structureComponents/page';

@Component({
  selector: 'app-primary-nav',
  templateUrl: './primary-nav.component.html',
  styleUrls: ['./primary-nav.component.scss']
})
export class PrimaryNavComponent implements OnInit {
  currentPageId: string;

  constructor(
    public settings: SettingsService,
    public pageService: PageService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.currentPageId = this.route.snapshot.paramMap.get('id');
    });
  }

}
