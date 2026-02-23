import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEventTypesComponent } from './page-event-types.component';

describe('PageEventTypesComponent', () => {
  let component: PageEventTypesComponent;
  let fixture: ComponentFixture<PageEventTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageEventTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageEventTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
