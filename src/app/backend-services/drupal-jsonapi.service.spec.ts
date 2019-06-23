import { TestBed } from '@angular/core/testing';

import { DrupalJsonApiBackendService } from './drupal-jsonapi.service';

describe('DrupalJsonapi.BackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrupalJsonApiBackendService = TestBed.get(DrupalJsonApiBackendService);
    expect(service).toBeTruthy();
  });
});
