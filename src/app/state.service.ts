/**
 * Similar to the settings service. Manages configuration that changes often,
 * such as during a session.
 */

import { Injectable } from '@angular/core';

import { Font } from './font';
import { FONTS } from './fonts';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  mode: string = 'edit'; // 'edit' | 'view'

  userId: string = '';
  userName: string = '';
  userRoles: [];

  backendSessionToken: string = null;

  inDemoMode: boolean = false;

  font: Font = FONTS.roboto;

  constructor() { }
}
