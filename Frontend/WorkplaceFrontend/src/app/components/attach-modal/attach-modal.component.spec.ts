import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachModalComponent } from './attach-modal.component';

describe('AttachModalComponent', () => {
  let component: AttachModalComponent;
  let fixture: ComponentFixture<AttachModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
