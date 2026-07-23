import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, inject, Output } from '@angular/core'
import { TimeSettingsComponent } from '../../../common-components/time-settings/time-settings.component'
import { TimeSettingsService } from '../../../common-service/lib/time-settings.service'
import { TimeSlot } from '../../public-booking.model'

@Component({
    selector: 'app-time-slot-selector',
    standalone: true,
    imports: [CommonModule, TimeSettingsComponent],
    templateUrl: './public-time-slot-selector.component.html',
    styleUrl: './public-time-slot-selector.component.css',
})
export class PublicTimeSlotSelectorComponent {
    @Input() slots: TimeSlot[] = []
    @Input() selectedSlot: TimeSlot | null = null
    @Input() selectedDate!: string
    @Input() loading = false

    @Output() slotSelected = new EventEmitter<TimeSlot>()
    @Output() back = new EventEmitter<void>()

    private timeSettingsService = inject(TimeSettingsService)

    get availableSlots(): TimeSlot[] {
        return this.slots.filter((x) => x.isAvailable)
    }

    formatTime(time: string): string {
        const d = new Date(time)
        return d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: !this.timeSettingsService.use24HourFormat(),
            timeZone: this.timeSettingsService.timezone(),
        })
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZone: this.timeSettingsService.timezone(),
        })
    }

    isSelected(slot: TimeSlot): boolean {
        return this.selectedSlot?.startTime === slot.startTime
    }

    onSlotClick(slot: TimeSlot) {
        if (this.loading) return
        this.slotSelected.emit(slot)
    }
}
