import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicBookingFormComponent } from './public-booking-form.component';

describe('BookingFormComponent', () => {
  let component: PublicBookingFormComponent;
  let fixture: ComponentFixture<PublicBookingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicBookingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicBookingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
