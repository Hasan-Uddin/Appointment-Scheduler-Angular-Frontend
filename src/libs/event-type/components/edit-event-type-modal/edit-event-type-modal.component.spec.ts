import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventTypeModalComponent } from './edit-event-type-modal.component';

describe('EditEventTypeModalComponent', () => {
  let component: EditEventTypeModalComponent;
  let fixture: ComponentFixture<EditEventTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEventTypeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEventTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
