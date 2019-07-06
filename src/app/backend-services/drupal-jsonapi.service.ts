import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { retry, catchError, tap, map, switchMap } from 'rxjs/operators';

import { DrupalPagesResponse } from './drupalPagesResponse';
import { ErrorHandlerService } from './error-handler.service';
import { SettingsService } from '../settings.service';

import { BackendBaseService } from './backendBase.service';
import { BackendService } from './backend-service';

import { Page } from '../structureComponents/page';

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

  transformPageToPayload(page: Page) {
    return {
      data: {
        type: "node--page",
        attributes: {
          title: page.title,
          body: JSON.stringify(page.sections)
        }
      }
    };
  }

  transformDataToPage(data: any): Page {
    // Convert Drupal's response format to a Page
    return {
      id: data.id,
      title: data.attributes.title,
      sections: JSON.parse(data.attributes.body.value)
    };
  }

  createPage(page: Page): Observable<Page> {
    var payload = this.transformPageToPayload(page);
    var url: string = this.settings.backendBaseUrl + this.backendPagePostPath;

    var request = this.http.post<DrupalPagesResponse>(url, payload, this.httpOptions)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        map(data => this.transformDataToPage(data.data)),
        catchError(this.errorHandler.handleError)
      );
    return request;
  }

  fetchPage(id: string): Observable<Page> {
    var url: string = this.settings.backendBaseUrl + this.backendPageGetPath;
    url = url.replace('[id]', id);
    var request: Observable<Page> = this.http.get<DrupalPagesResponse>(url)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        map(data => this.transformDataToPage(data.data)),
        catchError(this.errorHandler.handleError)
      );
    return request;
  }

  updatePage(page: Page): Observable<Page> {
    var payload = this.transformPageToPayload(page);
    payload.data['id'] = page.id;
    var url: string = this.settings.backendBaseUrl + this.backendPagePatchPath;
    url = url.replace('[id]', page.id);

    var request = this.http.patch(url, payload, this.httpOptions)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        map((data: any) => this.transformDataToPage(data.data)),
        catchError(this.errorHandler.handleError)
      );
    return request;
  }

  deletePage(page: Page): Observable<Object> {
    var url: string = this.settings.backendBaseUrl + this.backendPageDeletePath;
    url = url.replace('[id]', page.id);

    var request = this.http.delete(url, this.httpOptions);
    request.subscribe(() => {});
    return request;
  }

  fetchPages(): Observable<Page> {
    var url: string = this.settings.backendBaseUrl + this.backendPagesGetPath;
    var request: Observable<Page> = this.http.get<DrupalPagesResponse>(url)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        switchMap((data: any) => {
          // For each page in the array, emit a distinct page value through the observable
          return of.apply(this, data.data);
        }),
        map(page => this.transformDataToPage(page)),
        catchError(this.errorHandler.handleError)
      );
    return request;
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
