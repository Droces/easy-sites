import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  currentState = 'Unsaved';

  tokenFetchedEvent = new Event('tokenFetched');

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

  fetchToken(): Observable<string> {
    const options: Object = {
      responseType: "text",
      withCredentials: true
    };
    var url = this.settings.backendBaseUrl + this.settings.backendTokenPath;
    var request: Observable<string> = this.http.get<string>(url, options);
    request.subscribe(data => {
      this.saveToken(data);
      document.dispatchEvent(this.tokenFetchedEvent);
    });
    return request;
  }

  saveToken(token: string): void {
    this.settings.backendSessionToken = token;
    this.httpOptions.headers = this.httpOptions.headers.set('x-csrf-token', token);
  }

  handleError(error: HttpErrorResponse): Observable<never> {
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

  fetchCurrentUserId(): Observable<Object> {
    var url: string = this.settings.backendBaseUrl + '/jsonapi/';
    var request: Observable<any> = this.http.get(url, this.httpOptions);
    request.subscribe(data => {
      if (! data.hasOwnProperty('meta')) {
        // alert('You are not logged in');
        return null;
      }
      var userId = data.meta.links.me.meta.id;
      // console.log('userId: ', userId);
      // @todo check that this is a valid id
      this.settings.currentUserId = userId;

      this.fetchCurrentUser();
    });
    return request;
  };

  fetchCurrentUser(): Observable<Object> {
    var url: string = this.settings.backendBaseUrl + '/jsonapi/user/user/' + this.settings.currentUserId;
    var request: Observable<any> = this.http.get(url, this.httpOptions);
    request.subscribe(data => {
      this.saveUserDrupal(data.data);
    });
    return request;
  };

  saveUserDrupal(data): void {
    // console.log('user data: ', data);
    var name: string = data.attributes.name;
    this.settings.currentUserName = name;
    this.settings.currentUserRoles = data.relationships.roles.data;
    // console.log('this.settings.currentUserRoles: ', this.settings.currentUserRoles);
  }
}
