import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotWorkspaceComponent } from './chatbot-workspace.component';

describe('ChatbotWorkspaceComponent', () => {
  let component: ChatbotWorkspaceComponent;
  let fixture: ComponentFixture<ChatbotWorkspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatbotWorkspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
