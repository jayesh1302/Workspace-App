import { TestBed } from '@angular/core/testing';

import { OpenAIServiceService } from './open-aiservice.service';

describe('OpenAIServiceService', () => {
  let service: OpenAIServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenAIServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
