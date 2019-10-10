import { Component, OnInit } from '@angular/core';

import { SettingsService } from '../settings.service';
import { StateService } from '../state.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  public users = [];

  constructor(
    public settings: SettingsService,
    public state: StateService,
    public httpService: HttpService) { }

  ngOnInit() {
    this.fetchPages();
  }

  fetchPages(): void {
	  // this.httpService.instance.fetchUsers();

    this.users = [];

    const request = this.httpService.instance.fetchUsers();
    // Parameters are functions: next(), error(), finished().
    request.subscribe(
      (user: any) => {
        // console.log(user);
        // Store returned pages
        this.users.push(user);
      },
      () => {}, // @todo handle error
      () => {
        // console.log(this.users);
        // document.dispatchEvent(this.usersFetchedEvent);
      }
    );
  }
}
