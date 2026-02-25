import { CommonModule } from '@angular/common'
import { Component, OnInit, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MessageService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { ButtonModule } from 'primeng/button'
import { PublicBookingStateService } from '../../../../libs/public-booking'
import { PublicBookingFormComponent } from '../../../../libs/public-booking/components/public-booking-form/public-booking-form.component'
import { PublicCalendarViewComponent } from '../../../../libs/public-booking/components/public-calendar-view/public-calendar-view.component'
import { PublicTimeSlotSelectorComponent } from '../../../../libs/public-booking/components/public-time-slot-selector/public-time-slot-selector.component'
import { TimeSlot, CreatePublicBookingRequest } from '../../../../libs/public-booking/public-booking.model'
import { PublicBookingApiService } from '../../../../libs/public-booking/public-booking-api.service'


@Component({
    selector: 'app-page-public-booking',
    standalone: true,
    imports: [
        CommonModule,
        ToastModule,
        ProgressSpinnerModule,
        ButtonModule,
        PublicCalendarViewComponent,
        PublicTimeSlotSelectorComponent,
        PublicBookingFormComponent,
    ],
    templateUrl: './page-public-booking.component.html',
    providers: [MessageService, PublicBookingStateService],
})
export class PagePublicBookingComponent implements OnInit {
    protected publicBookingStateService = inject(PublicBookingStateService)
    private publicBookingService = inject(PublicBookingApiService)
    private route = inject(ActivatedRoute)
    protected router = inject(Router)
    private messageService = inject(MessageService)

    ngOnInit(): void {
        const username = this.route.snapshot.paramMap.get('username')
        const slug = this.route.snapshot.paramMap.get('event-slug') ?? this.route.snapshot.paramMap.get('slug')

        if (!username || !slug) {
            this.router.navigate(['/'])
            return
        }

        this.publicBookingStateService.init(username, slug)
    }

    onDateSelected(date: string) {
        this.publicBookingStateService.selectDate(date)
    }

    onSlotSelected(slot: TimeSlot) {
        this.publicBookingStateService.selectSlot(slot)
    }

    onBackFromTime() {
        this.publicBookingStateService.backToDateSelection()
    }

    onBackFromForm() {
        this.publicBookingStateService.backToTimeSelection()
    }

    onSubmitBooking(formValue: {
        guestName: string
        guestEmail: string
        guestPhone?: string
        notes?: string
    }) {
        const state = this.publicBookingStateService.getState()
        const eventType = state.eventType
        const slot = state.selectedSlot
        const date = state.selectedDate

        if (!eventType || !slot || !date) {
            return
        }

        const request: CreatePublicBookingRequest = {
            eventTypeId: eventType.id,
            guestName: formValue.guestName,
            guestEmail: formValue.guestEmail,
            guestPhone: formValue.guestPhone,
            startTime: slot.startTime,
            notes: formValue.notes,
        }

        this.publicBookingService.createBooking(request).subscribe({
            next: (confirmation) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Booking Confirmed',
                    detail: 'We have emailed your confirmation details.',
                    life: 5000,
                })

                // Optionally, navigate to a dedicated confirmation page
                this.router.navigate(['/booking-confirmed'], {
                    state: { confirmation },
                })
            },
            error: (err) => {
                console.error('Booking failed:', err)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Booking Failed',
                    detail: 'Please try again later.',
                    life: 5000,
                })
            },
        })
    }

    getCurrentStep(): 'date' | 'time' | 'form' {
        return this.publicBookingStateService.getCurrentStep()
    }
}