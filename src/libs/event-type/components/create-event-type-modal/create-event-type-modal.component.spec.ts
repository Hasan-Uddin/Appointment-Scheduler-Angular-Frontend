import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventTypeModalComponent } from './create-event-type-modal.component';

describe('CreateEventTypeModalComponent', () => {
  let component: CreateEventTypeModalComponent;
  let fixture: ComponentFixture<CreateEventTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEventTypeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEventTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
