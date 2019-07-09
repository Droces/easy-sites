/**
 * Similar to the state service. Manages configuration that isn't changed often,
 * and needs to be changed using the Settings page.
 */


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  siteName: string = '';

  themeColours = [
    {name: 'blue', hex: '#1e6c93'},
    {name: 'green', hex: '#138275'}
  ];
  themeActiveColour: string = 'blue';

  backendBaseUrl: string =        null;
  backendCms: string =            null;

  constructor() { }

  retrieveSettings(): void {
    this.backendBaseUrl = localStorage.getItem('backendBaseUrl');
    this.siteName = localStorage.getItem('siteName');
  }
}
