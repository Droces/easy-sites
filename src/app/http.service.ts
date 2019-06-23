import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// import { BackendService } from './backend-services/backend-service';
import { DrupalJsonApiBackendService } from './backend-services/drupal-jsonapi.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  currentState = 'Unsaved';

  constructor(
    public backendService: DrupalJsonApiBackendService) { }

  ngOnInit(): void {}

  authenticate(): Observable<string> {
    return this.backendService.fetchToken();
  }

  fetchCurrentUserId(): Observable<Object> {
    return this.backendService.fetchCurrentUserId();
  };
}
