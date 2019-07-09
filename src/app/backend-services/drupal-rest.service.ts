// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { retry, catchError, tap } from 'rxjs/operators';
//
// import { ErrorHandlerService } from './error-handler.service';
// import { SettingsService } from '../settings.service';
//
// import { BackendBaseService } from './backendBase.service';
// import { BackendService } from './backend-service';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class DrupalRestBackendService extends BackendBaseService implements BackendService {
//
//   tokenFetchedEvent = new Event('tokenFetched');
//   authenticatedEvent = new Event('authenticated');
//
//   httpOptions = {
//     headers: new HttpHeaders({
//       'Accept':         'application/vnd.api+json',
//       'Content-Type':   'application/vnd.api+json'
//     }),
//     withCredentials: true
//   };
//
//   cmsName: string = 'Drupal';
//   pluginName: string = 'RestfulWebServices';
//
//   backendTokenPath: string =      "/rest/session/token";
//   backendPagesGetPath: string =   "/node/all?_format=json"; // Provided by a created view
//   backendPagePostPath: string =   "/node?_format=json";
//   backendPageGetPath: string =    "/node/[id]?_format=json";
//   backendPagePatchPath: string =  "/node/[id]?_format=json";
//   backendPageDeletePath: string = "/node/[id]?_format=json";
//   backendUserGetPath: string =    "user/current?_format=json"; // Provided by a created view
//   backendUserIdGetPath: string =  "user/current?_format=json"; // Provided by a created view
//   backendLoginPagePath: string =  "/user/login";
//
//   constructor(
//     public settings: SettingsService,
//     public errorHandler: ErrorHandlerService,
//     public http: HttpClient) {
//     super(settings, errorHandler, http);
//   }
//
//   fetchCurrentUserId(): Observable<Object> {
//     return this.fetchCurrentUser();
//   };
//
//   fetchCurrentUser(): Observable<Object> {
//     var url: string = this.settings.backendBaseUrl + this.backendUserGetPath;
//     url = url.replace('[id]', this.state.userId);
//     var request: Observable<any> = this.http.get(url, this.httpOptions);
//     request.subscribe(data => {
//       // console.log('user data: ', data);
//       // if (! data.hasOwnProperty('')) {
//       //   // alert('You are not logged in');
//       //   return null;
//       // }
//       // @todo check that this is a valid id
//       this.state.userId = data[0].uid[0].value;
//       this.state.userName = data[0].name[0].value;
//       this.state.userRoles = data[0].roles; // [0].target_id;
//     });
//     return request;
//   };
//
//   postFile(fileToUpload: File): Observable<Object> {
//     const endpoint = this.settings.backendBaseUrl + '';
//     const formData: FormData = new FormData();
//     formData.append('fileKey', fileToUpload, fileToUpload.name);
//
//     var httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type':   'application/octet-stream',
//         'Accept':         'application/vnd.api+json',
//         'Content-Disposition': 'file; filename="filename.jpg"'
//       }),
//       withCredentials: true
//     };
//
//     // httpOptions.headers = httpOptions.headers.set('x-csrf-token', this.state.backendSessionToken);
//
//     return this.http.post(endpoint, formData, httpOptions);
//   }
// }
