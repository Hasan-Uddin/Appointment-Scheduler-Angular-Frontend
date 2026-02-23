import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeTileComponent } from './event-type-tile.component';

describe('EventTypeTileComponent', () => {
  let component: EventTypeTileComponent;
  let fixture: ComponentFixture<EventTypeTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTypeTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
