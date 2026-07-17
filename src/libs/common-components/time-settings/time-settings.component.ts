import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { SelectModule } from 'primeng/select'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { TimeSettingsService } from '../../common-service/lib/time-settings.service'

@Component({
    selector: 'app-time-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, SelectModule, ToggleButtonModule],
    templateUrl: './time-settings.component.html',
    styleUrl: './time-settings.component.css',
})
export class TimeSettingsComponent {
    public timeSettingsService = inject(TimeSettingsService)

    get selectedTimezone(): string {
        return this.timeSettingsService.timezone()
    }

    set selectedTimezone(val: string) {
        this.timeSettingsService.setTimezone(val)
    }

    get is24Hour(): boolean {
        return this.timeSettingsService.use24HourFormat()
    }

    set is24Hour(val: boolean) {
        this.timeSettingsService.setUse24HourFormat(val)
    }

    get timezones(): any[] {
        return this.timeSettingsService.availableTimezones.map((tz) => ({
            label: tz,
            value: tz,
        }))
    }
}
