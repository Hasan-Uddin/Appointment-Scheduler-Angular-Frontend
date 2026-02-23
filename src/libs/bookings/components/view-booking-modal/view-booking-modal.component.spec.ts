import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ViewBookingModalComponent } from './view-booking-modal.component'

describe('ViewBookingModalComponent', () => {
    let component: ViewBookingModalComponent
    let fixture: ComponentFixture<ViewBookingModalComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ViewBookingModalComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(ViewBookingModalComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
