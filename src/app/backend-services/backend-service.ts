import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../structureComponents/page';

export interface BackendService {
  tokenFetchedEvent?: Event;
  authenticatedEvent?: Event;
  httpOptions: {
    headers: HttpHeaders,
    withCredentials?: boolean
  }

  cmsName: string;
  pluginName: string;

  backendTokenPath: string;
  backendPagesGetPath: string;
  backendPagePostPath: string;
  backendPageGetPath: string;
  backendPagePatchPath: string;
  backendPageDeletePath: string;
  backendLoginPagePath: string;

  authenticate(): Observable<string>;

  fetchToken?(): Observable<string>;
  saveToken?(token: string): void;

  createPage(url: string, payload): Observable<Object>;
  fetchPage(id: string): Observable<Page>;
  fetchPages(): Observable<Object>;
  updatePage(url: string, payload): Observable<Object>;
  deletePage(url: string): Observable<Object>;
  fetchPages(): Observable<Page>;

  fetchCurrentUserId(): Observable<Object>;
  fetchCurrentUser(): Observable<Object>;

  postFile(fileData, fileName: string): Observable<Object>;
  attachFile?(fileId: string, pageId: string): Observable<Object>;
}
