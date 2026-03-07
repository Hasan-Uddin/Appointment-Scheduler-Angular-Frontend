import { CommonModule } from '@angular/common'
import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    inject,
} from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { PublicBookingFormService } from '../../public-booking-form.service'
import { PublicEventType, TimeSlot } from '../../public-booking.model'
import { TextareaModule } from 'primeng/textarea'

@Component({
    selector: 'app-booking-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
    ],
    templateUrl: './public-booking-form.component.html',
    styleUrl: './public-booking-form.component.css',
    providers: [PublicBookingFormService],
})
export class PublicBookingFormComponent implements OnInit {
    protected formService = inject(PublicBookingFormService)

    @Input() eventType!: PublicEventType
    @Input() selectedSlot!: TimeSlot
    @Input() selectedDate!: string
    @Input() loading = false

    @Output() submitBooking = new EventEmitter<{
        guestName: string
        guestEmail: string
        guestPhone?: string
        notes?: string
    }>()
    @Output() back = new EventEmitter<void>()

    ngOnInit() {
        this.formService.loadGuestInfo()
    }

    formatDate(date: string): string {
        const d = new Date(date + 'T00:00:00Z')
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
        })
    }

    formatTime(time: string): string {
        const d = new Date(time)

        return d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC',
        })
    }

    onSubmit() {
        if (!this.formService.isValid()) {
            this.formService.markAllAsTouched()
            return
        }

        this.formService.saveGuestInfo()
        this.submitBooking.emit(this.formService.getValue())
    }

    onBack() {
        this.back.emit()
    }
}
