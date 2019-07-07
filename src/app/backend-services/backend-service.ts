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

  createPage(urpage: Page): Observable<Page>;
  fetchPage(id: string): Observable<Page>;
  updatePage(page: Page): Observable<Page>;
  deletePage(page: Page): Observable<Object>;
  fetchPages(): Observable<Page>;

  fetchCurrentUserId(): Observable<Object>;
  fetchCurrentUser(): Observable<Object>;

  postFile(fileData, fileName: string): Observable<Object>;
  attachFile?(fileId: string, pageId: string): Observable<Object>;
  updateFile(fileId: string): Observable<Object>;
}
