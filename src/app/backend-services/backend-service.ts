import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  fetchPage(id: string): Observable<Object>;
  fetchPages(): Observable<Object>;
  updatePage(url: string, payload): Observable<Object>;
  deletePage(url: string): Observable<Object>;

  fetchCurrentUserId(): Observable<Object>;
  fetchCurrentUser(): Observable<Object>;

  postFile(fileToUpload: File): Observable<Object>;
}
