import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';

import { ErrorHandlerService } from './error-handler.service';
import { SettingsService } from '../settings.service';

import { BackendService } from './backend-service';

@Injectable({
  providedIn: 'root'
})
export class DrupalJsonApiBackendService implements BackendService {

  tokenFetchedEvent = new Event('tokenFetched');
  authenticatedEvent = new Event('authenticated');

  httpOptions = {
    headers: new HttpHeaders({
      'Accept':         'application/vnd.api+json',
      'Content-Type':   'application/vnd.api+json'
    }),
    withCredentials: true
  };

  backendTokenPath: string =      "/session/token";
  backendPagesGetPath: string =   "/jsonapi/node/page";
  backendPagePostPath: string =   "/jsonapi/node/page";
  backendPageGetPath: string =    "/jsonapi/node/page/[id]";
  backendPagePatchPath: string =  "/jsonapi/node/page/[id]";
  backendPageDeletePath: string = "/jsonapi/node/page/[id]";
  backendLoginPagePath: string =  "/user/login";

  constructor(
    public settings: SettingsService,
    public errorHandler: ErrorHandlerService,
    private http: HttpClient) {}

  authenticate(): Observable<string> {
    return this.fetchToken();
  }

  fetchToken(): Observable<string> {
    const options: Object = {
      responseType: "text",
      withCredentials: true
    };
    var url = this.settings.backendBaseUrl + this.backendTokenPath;
    var request: Observable<string> = this.http.get<string>(url, options)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        tap(
          data => {
            console.log('token: ', data);
            this.saveToken(data);
            document.dispatchEvent(this.tokenFetchedEvent);
          }
        ),
        catchError(this.errorHandler.handleError)
      );

    return request;
  }

  saveToken(token: string): void {
    this.settings.backendSessionToken = token;
    this.httpOptions.headers = this.httpOptions.headers.set('x-csrf-token', token);
  }

  createPage(url: string, payload): Observable<Object> {
    var request = this.http.patch(url, payload, this.httpOptions);
    // request.subscribe(response => {});
    return request;
  }

  updatePage(url: string, payload): Observable<Object> {
    var request = this.http.patch(url, payload, this.httpOptions);
    // request.subscribe(response => {});
    return request;
  }

  deletePage(url: string): Observable<Object> {
    var request = this.http.delete(url, this.httpOptions);
    request.subscribe(response => {});
    return request;
  }

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
      // console.log('user data: ', data);
      this.settings.currentUserName = data.attributes.name;
      this.settings.currentUserRoles = data.relationships.roles.data;
    });
    return request;
  };
}
