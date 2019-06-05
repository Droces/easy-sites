import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  themeColours = [
    {name: 'blue', hex: '#1e6c93'},
    {name: 'green', hex: '#138275'}
  ];
  themeActiveColour: string = 'blue';

  backend_session_token =   null;
  backend_base_url =        "http://esd.docker.localhost";
  backend_token_url =       this.backend_base_url + "/session/token";
  backend_pages_get_url =    this.backend_base_url + "/jsonapi/node/page";
  backend_page_post_url =   this.backend_base_url + "/jsonapi/node/page";
  backend_page_get_url =    this.backend_base_url + "/jsonapi/node/page/[id]";
  backend_page_patch_url =  this.backend_base_url + "/jsonapi/node/page/[id]";

  constructor() { }
}
