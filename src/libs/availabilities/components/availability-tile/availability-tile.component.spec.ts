import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityTileComponent } from './availability-tile.component';

describe('AvailabilityTileComponent', () => {
  let component: AvailabilityTileComponent;
  let fixture: ComponentFixture<AvailabilityTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilityTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
