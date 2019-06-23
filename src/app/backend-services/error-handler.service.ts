import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() {}

  handleError(error: HttpErrorResponse): Observable<never> {
    // console.log('error: ', error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    }
    else if (error.status === 0) {
      // The backend did not return a response.
      console.error('An error occurred:', error.message);
    }
    else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      var responseBody = JSON.parse(error.error);
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: `, responseBody);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
