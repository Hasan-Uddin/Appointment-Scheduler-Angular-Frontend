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

    public convertLocalToUtc(
        dayOfWeek: number,
        timeString: string,
    ): { dayOfWeek: number; time: string } {
        if (!timeString) return { dayOfWeek, time: timeString }
        const [hour, minute] = timeString.split(':').map(Number)
        const offsetMinutes = this.getTimezoneOffsetMinutes()

        let utcMinutes = hour * 60 + minute - offsetMinutes
        let utcDay = dayOfWeek

        if (utcMinutes < 0) {
            utcMinutes += 24 * 60
            utcDay = (utcDay - 1 + 7) % 7
        } else if (utcMinutes >= 24 * 60) {
            utcMinutes -= 24 * 60
            utcDay = (utcDay + 1) % 7
        }

        const utcHourStr = Math.floor(utcMinutes / 60)
            .toString()
            .padStart(2, '0')
        const utcMinStr = (utcMinutes % 60).toString().padStart(2, '0')

        return {
            dayOfWeek: utcDay,
            time: `${utcHourStr}:${utcMinStr}`,
        }
    }

    public convertUtcToLocal(
        dayOfWeek: number,
        timeString: string,
    ): { dayOfWeek: number; time: string } {
        if (!timeString) return { dayOfWeek, time: timeString }
        const [hour, minute] = timeString.split(':').map(Number)
        const offsetMinutes = this.getTimezoneOffsetMinutes()

        let localMinutes = hour * 60 + minute + offsetMinutes
        let localDay = dayOfWeek

        if (localMinutes < 0) {
            localMinutes += 24 * 60
            localDay = (localDay - 1 + 7) % 7
        } else if (localMinutes >= 24 * 60) {
            localMinutes -= 24 * 60
            localDay = (localDay + 1) % 7
        }

        const localHourStr = Math.floor(localMinutes / 60)
            .toString()
            .padStart(2, '0')
        const localMinStr = (localMinutes % 60).toString().padStart(2, '0')

        return {
            dayOfWeek: localDay,
            time: `${localHourStr}:${localMinStr}`,
        }
    }

    private getTimezoneOffsetMinutes(): number {
        const targetTimezone = this.timezone()
        const date = new Date()
        const utcDate = new Date(
            date.toLocaleString('en-US', { timeZone: 'UTC' }),
        )
        const tzDate = new Date(
            date.toLocaleString('en-US', { timeZone: targetTimezone }),
        )
        return Math.round((tzDate.getTime() - utcDate.getTime()) / 60000)
    }
}
