import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAvailabilityModalComponent } from './create-availability-modal.component';

describe('CreateAvailabilityModalComponent', () => {
  let component: CreateAvailabilityModalComponent;
  let fixture: ComponentFixture<CreateAvailabilityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAvailabilityModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAvailabilityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
