import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  currentState = 'Unsaved';

  httpOptions = {
    headers: new HttpHeaders({
      'Accept':         'application/vnd.api+json',
      'Content-Type':   'application/vnd.api+json'
    }),
    withCredentials: true
  };

  constructor(
    public settings: SettingsService,
    private http: HttpClient) { }

  fetchToken() {
    var options = this.httpOptions;
    options['responseType'] = 'text';
    return this.http.get(this.settings.backend_token_url, options);
  }

  saveToken(token) {
    this.settings.backend_session_token = token;
    this.httpOptions.headers = this.httpOptions.headers.set('x-csrf-token', token);
  }
}
