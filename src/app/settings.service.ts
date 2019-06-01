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

  constructor() { }
}
