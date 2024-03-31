import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizeModalComponent } from './summarize-modal.component';

describe('SummarizeModalComponent', () => {
  let component: SummarizeModalComponent;
  let fixture: ComponentFixture<SummarizeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarizeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummarizeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
