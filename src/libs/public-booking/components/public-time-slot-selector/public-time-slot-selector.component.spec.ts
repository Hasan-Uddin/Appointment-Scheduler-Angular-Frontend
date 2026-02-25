import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicTimeSlotSelectorComponent } from './public-time-slot-selector.component';

describe('TimeSlotSelectorComponent', () => {
  let component: PublicTimeSlotSelectorComponent;
  let fixture: ComponentFixture<PublicTimeSlotSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicTimeSlotSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicTimeSlotSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
