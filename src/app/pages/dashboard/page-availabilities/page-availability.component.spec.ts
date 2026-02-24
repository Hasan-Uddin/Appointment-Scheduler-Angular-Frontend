import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAvailabilityComponent } from './page-availability.component';

describe('PageAvailabilityComponent', () => {
  let component: PageAvailabilityComponent;
  let fixture: ComponentFixture<PageAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
