import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { PageService } from '../page.service';

import { Page } from '../page';

@Component({
  selector: 'app-primary-nav',
  templateUrl: './primary-nav.component.html',
  styleUrls: ['./primary-nav.component.scss']
})
export class PrimaryNavComponent implements OnInit {
  currentPageId: number;

  constructor(
    public pageService: PageService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.currentPageId = +this.route.snapshot.paramMap.get('id');
    });
  }

}
