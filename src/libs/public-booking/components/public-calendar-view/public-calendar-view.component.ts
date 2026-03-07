import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { AvailableDay } from '../../public-booking.model'

interface CalendarDay {
    date: string
    dayNumber: number
    isCurrentMonth: boolean
    isPast: boolean
    hasSlots: boolean
    slotsCount: number
}

@Component({
    selector: 'app-calendar-view',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    templateUrl: './public-calendar-view.component.html',
    styleUrl: './public-calendar-view.component.css',
})
export class PublicCalendarViewComponent {
    @Input() currentMonth!: Date
    @Input() availableDays: AvailableDay[] = []
    @Input() selectedDate: string | null = null
    @Input() loading = false

    @Output() dateSelected = new EventEmitter<string>()
    @Output() previousMonth = new EventEmitter<void>()
    @Output() nextMonth = new EventEmitter<void>()

    weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    get monthLabel(): string {
        return this.currentMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        })
    }

    get days(): CalendarDay[] {
        if (!this.currentMonth) return []

        const year = this.currentMonth.getFullYear()
        const month = this.currentMonth.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        const days: CalendarDay[] = []
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Padding before first day
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push({
                date: '',
                dayNumber: 0,
                isCurrentMonth: false,
                isPast: true,
                hasSlots: false,
                slotsCount: 0,
            })
        }

        // Actual days
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const dateObj = new Date(Date.UTC(year, month, d))
            const dateStr = dateObj.toISOString().split('T')[0]

            const dayInfo = this.availableDays.find((x) => x.date === dateStr)

            const isPast = dateObj < today
            days.push({
                date: dateStr,
                dayNumber: d,
                isCurrentMonth: true,
                isPast,
                hasSlots: dayInfo?.hasSlots ?? false,
                slotsCount: dayInfo?.slotsCount ?? 0,
            })
        }

        return days
    }

    onDayClick(day: CalendarDay) {
        if (
            !day.isCurrentMonth ||
            !day.hasSlots ||
            day.isPast ||
            this.loading
        ) {
            return
        }

        this.dateSelected.emit(day.date)
    }

    isSelected(date: string): boolean {
        return !!date && date === this.selectedDate
    }
}