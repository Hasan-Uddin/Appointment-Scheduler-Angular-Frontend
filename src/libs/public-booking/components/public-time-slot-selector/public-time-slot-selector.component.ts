import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { TimeSlot } from '../../public-booking.model'

@Component({
    selector: 'app-time-slot-selector',
    standalone: true,
    imports: [CommonModule],
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

    get availableSlots(): TimeSlot[] {
        return this.slots.filter((x) => x.isAvailable)
    }

    formatTime(time: string): string {
        const d = new Date(time)
        return d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC'
        })
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC'
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