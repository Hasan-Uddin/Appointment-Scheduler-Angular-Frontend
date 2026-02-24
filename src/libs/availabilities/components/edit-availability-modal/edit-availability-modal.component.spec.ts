import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAvailabilityModalComponent } from './edit-availability-modal.component';

describe('EditAvailabilityModalComponent', () => {
  let component: EditAvailabilityModalComponent;
  let fixture: ComponentFixture<EditAvailabilityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAvailabilityModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAvailabilityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
