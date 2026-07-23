import { CommonModule } from '@angular/common'
import { Component, inject, input, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MenuItem } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { MenuModule } from 'primeng/menu'
import { TagModule } from 'primeng/tag'
import { AppTimePipe } from '../../../common-pipes/app-time.pipe'
import { TimeSettingsService } from '../../../common-service/lib/time-settings.service'
import { Availability } from '../../availability.model'

@Component({
    selector: 'app-availability-tile',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TagModule,
        CheckboxModule,
        FormsModule,
        MenuModule,
        AppTimePipe,
    ],
    templateUrl: './availability-tile.component.html',
    styleUrl: './availability-tile.component.css',
})
export class AvailabilityTileComponent {
    availability = input.required<Availability>()
    selected = input<boolean>(false)

    selectionChange = output<boolean>()
    edit = output<Availability>()
    delete = output<Availability>()
    toggleActive = output<Availability>()

    menuItems: MenuItem[] = []

    ngOnInit() {
        this.menuItems = [
            {
                label: 'Edit',
                icon: 'pi pi-pencil',
                command: () => this.edit.emit(this.availability()),
            },
            {
                label: this.availability().isActive ? 'Deactivate' : 'Activate',
                icon: this.availability().isActive
                    ? 'pi pi-eye-slash'
                    : 'pi pi-eye',
                command: () => this.toggleActive.emit(this.availability()),
            },
            { separator: true },
            {
                label: 'Delete',
                icon: 'pi pi-trash',
                styleClass: 'text-red-500',
                command: () => this.delete.emit(this.availability()),
            },
        ]
    }

    onSelectionChange(checked: boolean) {
        this.selectionChange.emit(checked)
    }

    getDayName(day: number): string {
        const days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ]
        return days[day]
    }

    getDuration(): string {
        const [startHour, startMin] = this.availability()
            .startTime.split(':')
            .map(Number)
        const [endHour, endMin] = this.availability()
            .endTime.split(':')
            .map(Number)

        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin
        const duration = endMinutes - startMinutes

        const hours = Math.floor(duration / 60)
        const mins = duration % 60

        if (hours === 0) return `${mins} min`
        if (mins === 0) return `${hours} hr`
        return `${hours} hr ${mins} min`
    }

    private timeSettingsService = inject(TimeSettingsService)

    formatTime(time: string): string {
        const [hour, minute] = time.split(':').map(Number)
        if (this.timeSettingsService.use24HourFormat()) {
            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        }
        const period = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`
    }
}
