import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { retry, catchError, tap, map, switchMap } from 'rxjs/operators';

import { DrupalPagesResponse } from './drupalPagesResponse';
import { ErrorHandlerService } from './error-handler.service';
import { SettingsService } from '../settings.service';
import { StateService } from '../state.service';

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
  backendUsersGetPath: string =   "/jsonapi/user/user";
  backendLoginPagePath: string =  "/user/login";
  backendLogoutPagePath: string = "/user/logout";

  constructor(
    public settings: SettingsService,
    public state: StateService,
    public errorHandler: ErrorHandlerService,
    public http: HttpClient) {
    super(settings, state, errorHandler, http);
  }

  transformPageToPayload(page: Page) {
    let body = JSON.stringify({
      metadata: {
        path: page.path,
        navWeight: page.navWeight,
      },
      sections: page.sections,
      parent: page.parent,
    });
    return {
      data: {
        type: "node--page",
        attributes: {
          title: page.title,
          body: body
        }
      }
    };
  }

  /**
   * Convert Drupal's response format to a Page
   */
  transformDataToPage(data: any): Page {
    let body: any;
    try {
      body = JSON.parse(data.attributes.body.value);
    }
    catch (error) {
      console.error(error);
    }
    // console.log('body:', body);
    const page: Page = {
      id: data.id,
      path: body.metadata.path,
      navWeight: body.metadata.navWeight,
      title: data.attributes.title,
      sections: body.sections,
      state: {
        isListMenuOpen: false
      },
      parent: body.parent
    };
    return page;
  }

  createPage(page: Page): Observable<Page> {
    const payload = this.transformPageToPayload(page);
    let url: string = this.settings.backendBaseUrl + this.backendPagePostPath;

    return this.http.post<DrupalPagesResponse>(url, payload, this.httpOptions)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        map(data => this.transformDataToPage(data.data)),
        catchError(this.errorHandler.handleError)
      );
  }

  fetchPage(id: string): Observable<Page> {
    let url: string = this.settings.backendBaseUrl + this.backendPageGetPath;
    url = url.replace('[id]', id);
    return this.http.get<DrupalPagesResponse>(url)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        map(data => this.transformDataToPage(data.data)),
        catchError(this.errorHandler.handleError)
      );
  }

  updatePage(page: Page): Observable<Page> {
    const payload = this.transformPageToPayload(page);
    payload.data['id'] = page.id;
    let url: string = this.settings.backendBaseUrl + this.backendPagePatchPath;
    url = url.replace('[id]', page.id);

    return this.http.patch(url, payload, this.httpOptions)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        map((data: any) => this.transformDataToPage(data.data)),
        catchError(this.errorHandler.handleError)
      );
  }

  deletePage(page: Page): Observable<Object> {
    let url: string = this.settings.backendBaseUrl + this.backendPageDeletePath;
    url = url.replace('[id]', page.id);

    const request = this.http.delete(url, this.httpOptions);
    request.subscribe(() => {});
    return request;
  }

  /**
   * Should only be called through the PageService.fetchPages().
   */
  fetchPages(): Observable<Page> {
    let url: string = this.settings.backendBaseUrl + this.backendPagesGetPath;
    return this.http.get<DrupalPagesResponse>(url)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        switchMap((data: any) => {
          // For each page in the array, emit a distinct page value through the observable
          return of.apply(this, data.data);
        }),
        map(page => this.transformDataToPage(page)),
        catchError(this.errorHandler.handleError)
      );
  }

  fetchCurrentUserId(): Observable<Object> {
    let url: string = this.settings.backendBaseUrl + this.backendUserIdGetPath;
    const request: Observable<any> = this.http.get(url, this.httpOptions);
    request.subscribe(data => {
      if (! data.hasOwnProperty('meta')) {
        // alert('You are not logged in');
        return null;
      }
      let userId = data.meta.links.me.meta.id;
      // console.log('userId: ', userId);
      // @todo check that this is a valid id
      this.state.userId = userId;

      this.fetchCurrentUser();
    });
    return request;
  };

  fetchCurrentUser(): Observable<Object> {
    let url: string = this.settings.backendBaseUrl + this.backendUserGetPath;
    url = url.replace('[id]', this.state.userId);
    const request: Observable<any> = this.http.get(url, this.httpOptions);
    request.subscribe(data => {
      // console.log('user data: ', data);
      if (! (data.hasOwnProperty('data') && data.data.hasOwnProperty('attributes'))) {
        // alert('You are not logged in');
        return null;
      }
      this.state.userName = data.data.attributes.name;
      this.state.userRoles = data.data.relationships.roles.data;
    });
    return request;
  };

  /**
   * See [Allow creation of file entities from binary data | Drupal.org](https://www.drupal.org/node/3024331)
   * @param  fileData [description]
   * @param  fileName [description]
   * @return          [description]
   */
  postFile(fileData: string | ArrayBuffer, fileName: string): Observable<Object> {
    const endpoint: string = this.settings.backendBaseUrl + '/jsonapi/node/page/field_image';

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':   'application/octet-stream',
        'Accept':         'application/vnd.api+json',
        'Content-Disposition': 'file; filename="' + fileName + '"'
      }),
      withCredentials: true
    };

    httpOptions.headers = httpOptions.headers.set('x-csrf-token',
      this.state.backendSessionToken);

    return this.http.post(endpoint, fileData, httpOptions)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        map(data => {
          return {
            id: data['data']['id'],
            url: data['data']['attributes']['uri']['url']
          };
        }),
        catchError(this.errorHandler.handleError)
      );
  }

  createFilesPayload(fileId: string): Object {
    return {
      "data": [{
        "type": "file--file",
        "id": fileId,
        attributes: {
          status: true
        }
      }]
    };
  }

  /**
   * Page content type needs a "field_files" multi-value field
   * @param string fileId [description]
   * @param string pageId [description]
   * @return Observable<Object> [description]
   */
  attachFile(fileId: string, pageId: string): Observable<Object> {
    // console.log('attachFile()');
    let url: string = this.settings.backendBaseUrl
      + '/jsonapi/node/page/[id]/relationships/field_files';
    url = url.replace('[id]', pageId);

    let data = this.createFilesPayload(fileId);

    return this.http.post(url, data, this.httpOptions);
  }

  updateFile(fileId: string, makePermanent = true) {
    let url: string = this.settings.backendBaseUrl + '/jsonapi/file/file/[id]';
    url = url.replace('[id]', fileId);

    const data = {
      data: {
        type: "file--file",
        id: fileId,
        attributes: {
          status: true
        }
      }
    };
    if (! makePermanent)
      data['attributes']['status'] = false;

    return this.http.patch(url, data, this.httpOptions);
  }

  fetchUsers(): Observable<Object> {
    let url: string = this.settings.backendBaseUrl + this.backendUsersGetPath;
    return this.http.get(url)
      .pipe(
        retry(1), // retry a failed request up to 1 times
        switchMap((data: any) => {
          // For each user in the array, emit a distinct user value through the observable
          return of.apply(this, data.data);
        }),
        // map(page => this.transformDataToPage(page)),
        catchError(this.errorHandler.handleError)
      );
  }

  logout(): Observable<Object> {
    let url: string = this.settings.backendBaseUrl + this.backendLogoutPagePath;
    const data = [];
    // Http.post expects JSON response, so provide new headers to change that.
    return this.http.post(url, data, {responseType: "text", withCredentials: true});
  }
}
