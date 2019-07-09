/**
 * Similar to the settings service. Manages configuration that changes often,
 * such as during a session.
 */


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  mode: string = 'edit'; // 'edit' | 'view'

  userId: string = '';
  userName: string = '';
  userRoles: [];

  backendSessionToken: string = null;

  constructor() { }
}
