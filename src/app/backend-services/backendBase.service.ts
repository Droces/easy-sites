import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';

import { DrupalPagesResponse } from '../drupalPagesResponse';
import { ErrorHandlerService } from './error-handler.service';
import { SettingsService } from '../settings.service';

export abstract class BackendBaseService {

  tokenFetchedEvent = new Event('tokenFetched');
  authenticatedEvent = new Event('authenticated');

  httpOptions = {
    headers: new HttpHeaders({
      'Accept':         'application/vnd.api+json',
      'Content-Type':   'application/vnd.api+json'
    }),
    withCredentials: true
  };

  cmsName: string = '';
  pluginName: string ='';

  backendTokenPath: string =      "";
  backendPagesGetPath: string =   "";
  backendPagePostPath: string =   "";
  backendPageGetPath: string =    "";
  backendPagePatchPath: string =  "";
  backendPageDeletePath: string = "";
  backendUserGetPath: string =    "";
  backendUserIdGetPath: string =  "";
  backendLoginPagePath: string =  "";

  constructor(
    public settings: SettingsService,
    public errorHandler: ErrorHandlerService,
    public http: HttpClient) {}

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
            // console.log('token: ', data);
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

  fetchPage(id: string): Observable<Object> {
    var url: string = this.settings.backendBaseUrl + this.backendPageGetPath;
    url = url.replace('[id]', id);
    var request = this.http.get(url);
    return request;
  }

  fetchPages(): Observable<Object> {
    var url: string = this.settings.backendBaseUrl + this.backendPagesGetPath;
    var request: Observable<Object> = this.http.get(url)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        tap(
          data => {
            // console.log('pages data: ', data);
          }
        ),
        catchError(this.errorHandler.handleError)
      );
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
}
