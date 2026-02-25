import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCalendarViewComponent } from './public-calendar-view.component';

describe('CalendarViewComponent', () => {
  let component: PublicCalendarViewComponent;
  let fixture: ComponentFixture<PublicCalendarViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicCalendarViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
