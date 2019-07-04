import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';

import { ErrorHandlerService } from './error-handler.service';
import { SettingsService } from '../settings.service';

import { BackendBaseService } from './backendBase.service';
import { BackendService } from './backend-service';

@Injectable({
  providedIn: 'root'
})
export class DrupalJsonApiBackendService extends BackendBaseService implements BackendService {

  tokenFetchedEvent = new Event('tokenFetched');
  authenticatedEvent = new Event('authenticated');

  httpOptions = {
    headers: new HttpHeaders({
      'Accept':         'application/vnd.api+json',
      'Content-Type':   'application/vnd.api+json'
    }),
    withCredentials: true
  };

  cmsName: string = 'Drupal';
  pluginName: string = 'JSON:API';

  backendTokenPath: string =      "/session/token";
  backendPagesGetPath: string =   "/jsonapi/node/page";
  backendPagePostPath: string =   "/jsonapi/node/page";
  backendPageGetPath: string =    "/jsonapi/node/page/[id]";
  backendPagePatchPath: string =  "/jsonapi/node/page/[id]";
  backendPageDeletePath: string = "/jsonapi/node/page/[id]";
  backendUserGetPath: string =    "/jsonapi/user/user/[id]";
  backendUserIdGetPath: string =  "/jsonapi/";
  backendLoginPagePath: string =  "/user/login";

  constructor(
    public settings: SettingsService,
    public errorHandler: ErrorHandlerService,
    public http: HttpClient) {
    super(settings, errorHandler, http);
  }

  fetchCurrentUserId(): Observable<Object> {
    var url: string = this.settings.backendBaseUrl + this.backendUserIdGetPath;
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
    var url: string = this.settings.backendBaseUrl + this.backendUserGetPath;
    url = url.replace('[id]', this.settings.currentUserId);
    var request: Observable<any> = this.http.get(url, this.httpOptions);
    request.subscribe(data => {
      // console.log('user data: ', data);
      if (! (data.hasOwnProperty('data') && data.data.hasOwnProperty('attributes'))) {
        // alert('You are not logged in');
        return null;
      }
      this.settings.currentUserName = data.data.attributes.name;
      this.settings.currentUserRoles = data.data.relationships.roles.data;
    });
    return request;
  };

  postFile(fileData: string | ArrayBuffer, fileName: string): Observable<Object> {
    const endpoint = this.settings.backendBaseUrl + '/jsonapi/node/article/field_image';

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':   'application/octet-stream',
        'Accept':         'application/vnd.api+json',
        'Content-Disposition': 'file; filename="' + fileName + '"'
      }),
      withCredentials: true
    };

    httpOptions.headers = httpOptions.headers.set('x-csrf-token',
      this.settings.backendSessionToken);

    return this.http.post(endpoint, fileData, httpOptions);
  }

  attachFile(fileId: string, pageId: string): Observable<Object> {
    var url: string = this.settings.backendBaseUrl
      + '/jsonapi/node/article/[id]/relationships/field_image';
    url = url.replace('[id]', pageId);
    console.log('url: ', url);

    var data = {
      "data": {
        "type": "file--file",
        "id": fileId
        // "meta": {"description": ""}
      }
    };
    console.log('data: ', data);

    return this.http.post(url, data, this.httpOptions);
  }
}
