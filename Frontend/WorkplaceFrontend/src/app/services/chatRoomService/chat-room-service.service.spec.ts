import { TestBed } from '@angular/core/testing';

import { ChatRoomServiceService } from './chat-room-service.service';

describe('ChatRoomServiceService', () => {
  let service: ChatRoomServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatRoomServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
