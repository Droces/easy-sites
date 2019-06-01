import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  theme: string = 'blue';

  constructor() { }
}
