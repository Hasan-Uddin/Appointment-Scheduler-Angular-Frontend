import { DatePipe } from '@angular/common'
import { inject, Pipe, PipeTransform } from '@angular/core'
import { TimeSettingsService } from '../common-service/lib/time-settings.service'

@Pipe({
    name: 'appTime',
    standalone: true,
    pure: false, // Impure so it reacts to signal changes in TimeSettingsService
})
export class AppTimePipe implements PipeTransform {
    private datePipe = new DatePipe('en-US')
    private timeSettings = inject(TimeSettingsService)

    transform(
        value: string | number | Date | null | undefined,
        formatType: 'datetime' | 'time' | 'date' = 'datetime',
    ): string | null {
        if (!value) return null

        const timezone = this.timeSettings.timezone()
        const use24Hour = this.timeSettings.use24HourFormat()

        let formatString = ''

        switch (formatType) {
            case 'datetime':
                formatString = use24Hour
                    ? 'yyyy-MM-dd HH:mm'
                    : 'yyyy-MM-dd h:mm a'
                break
            case 'time':
                formatString = use24Hour ? 'HH:mm' : 'h:mm a'
                break
            case 'date':
                formatString = 'yyyy-MM-dd' // date usually doesn't change with 12/24hr
                break
            default:
                formatString = use24Hour
                    ? 'yyyy-MM-dd HH:mm'
                    : 'yyyy-MM-dd h:mm a'
        }

        return this.datePipe.transform(value, formatString, timezone)
    }
}
