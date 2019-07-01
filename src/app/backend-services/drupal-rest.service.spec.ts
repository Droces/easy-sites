import { TestBed } from '@angular/core/testing';

import { DrupalRestBackendService } from './drupal-rest.service';

describe('DrupalRestBackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrupalRestBackendService = TestBed.get(DrupalRestBackendService);
    expect(service).toBeTruthy();
  });
});
