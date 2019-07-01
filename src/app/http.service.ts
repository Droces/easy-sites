import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BackendService } from './backend-services/backend-service';
import { DrupalJsonApiBackendService } from './backend-services/drupal-jsonapi.service';
import { DrupalRestBackendService } from './backend-services/drupal-rest.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  currentState = 'Unsaved';

  backendServices = [
    'DrupalJsonApiBackendService',
    'DrupalRestBackendService',
  ];

  backendServiceName: string;

  constructor(
    public DrupalJsonApiBackendService: DrupalJsonApiBackendService,
    public DrupalRestBackendService: DrupalRestBackendService) {
      this.backendServiceName = 'DrupalJsonApiBackendService';
    }

  ngOnInit(): void {}

  authenticate(): Observable<string> {
    return this.instance.fetchToken();
  }

  fetchCurrentUserId(): Observable<Object> {
    return this.instance.fetchCurrentUserId();
  };

  switchBackendService(backendServiceName: string): void {
    if (! this.backendServices.includes(backendServiceName)) {
      // @todo Throw exception
      return null;
    }
    this.backendServiceName = backendServiceName;
  }

  public get instance(): BackendService {
    return this[this.backendServiceName];
  }
}
