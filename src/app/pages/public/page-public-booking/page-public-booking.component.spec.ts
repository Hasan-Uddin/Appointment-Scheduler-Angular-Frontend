import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePublicBookingComponent } from './page-public-booking.component';

describe('PagePublicBookingComponent', () => {
  let component: PagePublicBookingComponent;
  let fixture: ComponentFixture<PagePublicBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePublicBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePublicBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
