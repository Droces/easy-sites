import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  siteName: string = '';

  mode: string = 'edit'; // 'edit' | 'view'

  currentUserId: string = '';
  currentUserName: string = '';
  currentUserRoles: [];

  themeColours = [
    {name: 'blue', hex: '#1e6c93'},
    {name: 'green', hex: '#138275'}
  ];
  themeActiveColour: string = 'blue';

  backendSessionToken: string =   null;
  backendBaseUrl: string =        null;
  backendCms: string =            null;
  backendTokenPath: string =      "/session/token";
  backendPagesGetPath: string =   "/jsonapi/node/page";
  backendPagePostPath: string =   "/jsonapi/node/page";
  backendPageGetPath: string =    "/jsonapi/node/page/[id]";
  backendPagePatchPath: string =  "/jsonapi/node/page/[id]";
  backendPageDeletePath: string = "/jsonapi/node/page/[id]";
  backendLoginPagePath: string =  "/user/login";

  constructor() { }

  retrieveSettings(): void {
    this.backendBaseUrl = localStorage.getItem('backendBaseUrl');
    this.siteName = localStorage.getItem('siteName');
  }
}
