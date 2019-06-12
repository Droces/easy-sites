import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SettingsService } from '../settings.service';
import { PageService } from '../page.service';

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
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.currentPageId = this.route.snapshot.paramMap.get('id');
    });
  }

}
