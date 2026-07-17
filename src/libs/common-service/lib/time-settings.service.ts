import { Injectable, signal } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class TimeSettingsService {
    // Use Intl API to get the user's default timezone
    public readonly timezone = signal<string>(
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    )
    public readonly use24HourFormat = signal<boolean>(false)

    // List of all available timezones from the browser
    public readonly availableTimezones: string[] =
        Intl.supportedValuesOf('timeZone')

    public setTimezone(timezone: string): void {
        this.timezone.set(timezone)
    }

    public setUse24HourFormat(use24Hour: boolean): void {
        this.use24HourFormat.set(use24Hour)
    }
}
