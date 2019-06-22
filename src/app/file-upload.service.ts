import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    public settings: SettingsService,
    private http: HttpClient) { }

  postFile(fileToUpload: File): Observable<Object> {
    const endpoint = this.settings.backendBaseUrl + '/jsonapi/node/article/field_image';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':   'application/octet-stream',
        'Accept':         'application/vnd.api+json',
        'Content-Disposition': 'file; filename="filename.jpg"'
      }),
      withCredentials: true
    };

    httpOptions.headers = httpOptions.headers.set('x-csrf-token', this.settings.backendSessionToken);
    console.log('httpOptions: ', httpOptions);

    return this.http
      .post(endpoint, formData, httpOptions);
      // .map(() => { return true; })
      // .catch((e) => this.handleError(e));
  }

  handleError(error: HttpErrorResponse) {
    console.log('error: ', error);
  }
}
