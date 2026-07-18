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
        const date = new Date()
        return this.timeSettingsService.availableTimezones.map((tz) => {
            let offsetLabel = 'UTC'
            try {
                const parts = new Intl.DateTimeFormat('en-US', {
                    timeZone: tz,
                    timeZoneName: 'longOffset',
                }).formatToParts(date)

                const tzName = parts.find(
                    (p) => p.type === 'timeZoneName',
                )?.value
                if (tzName) {
                    offsetLabel = tzName.replace('GMT', 'UTC')
                }
            } catch (e) {
                // Fallback if timezone formatting fails
            }

            const city = tz.split('/').pop()?.replace(/_/g, ' ') || tz

            return {
                label: `(${offsetLabel}) ${city}`,
                value: tz,
            }
        })
    }
}
