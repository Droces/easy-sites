import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

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

  ngOnInit(): void {}

  fetchToken(): Observable<Object> {
    var options = this.httpOptions;
    options['responseType'] = 'text';
    var request = this.http.get(this.settings.backend_token_url, options);
    request.subscribe(data => {
      // console.log('token: ', data);
      this.saveToken(data);
    });
    return request;
  }

  saveToken(token) {
    this.settings.backend_session_token = token;
    this.httpOptions.headers = this.httpOptions.headers.set('x-csrf-token', token);
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      var responseBody = JSON.parse(error.error);
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: `, responseBody);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
