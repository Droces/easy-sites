import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map, switchMap } from 'rxjs/operators';

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
}
