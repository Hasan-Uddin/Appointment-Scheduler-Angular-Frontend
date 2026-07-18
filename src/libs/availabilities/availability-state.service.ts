import { Injectable, inject } from '@angular/core'
import {
    catchError,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    finalize,
    switchMap,
    tap,
    throwError,
} from 'rxjs'
import { SimpleStore } from '../store'
import {
    Availability,
    AvailabilityGrouped,
    DayOfWeek,
    UpdateAvailabilityDto,
} from './availability.model'
import { AvailabilityApiService } from './availability-api.service'

export type AvailabilityState = {
    availabilities: Availability[]
    selectedAvailabilities: Availability[]
    loading: boolean
    error: boolean
    userId: string
    selectedDayFilter?: number
    search?: string
}

const initialAvailabilityState: AvailabilityState = {
    availabilities: [],
    selectedAvailabilities: [],
    loading: false,
    error: false,
    userId: '',
    selectedDayFilter: undefined,
    search: '',
}

@Injectable()
export class AvailabilityStateService extends SimpleStore<AvailabilityState> {
    availabilityApiService = inject(AvailabilityApiService)

    constructor() {
        super(initialAvailabilityState)
    }

    init(userId: string) {
        if (!userId) return // safety check
        this.setState({ userId })
        this.continueLoadingAvailabilities()
    }

    private continueLoadingAvailabilities() {
        combineLatest([
            this.select('userId'),
            this.select('selectedDayFilter'),
            this.select('search'),
        ])
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => this.setState({ loading: true })),
                switchMap(([userId, dayOfWeek, search]) =>
                    this.availabilityApiService.findAllAvailabilities({
                        userId,
                        dayOfWeek,
                        search,
                    }),
                ),
            )
            .subscribe({
                next: (res) => {
                    this.setState({
                        loading: false,
                        availabilities: res,
                    })
                },
                error: () => {
                    this.setState({ loading: false, error: true })
                },
            })
    }

    deleteAvailability(id: string) {
        this.setState({ loading: true })
        return this.availabilityApiService.delete(id).pipe(
            tap(() => this.removeAvailabilityFromState(id)),
            catchError((error) => {
                console.error('Error deleting availability:', error)
                this.setState({ error: true })
                return throwError(
                    () => new Error('Failed to delete availability'),
                )
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    updateAvailability(id: string, data: UpdateAvailabilityDto) {
        const { availabilities } = this.getState()
        this.setState({ loading: true })
        const current = availabilities.find((a) => a.id === id)
        const merged: Availability = { ...current!, ...data }

        return this.availabilityApiService.updateAvailability(id, data).pipe(
            tap(() => this.replaceAvailability(merged)),
            catchError((error) => {
                console.error('Error updating availability:', error)
                this.setState({ error: true })
                return throwError(
                    () => new Error('Failed to update availability'),
                )
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    toggleActive(id: string) {
        this.setState({ loading: true })
        return this.availabilityApiService.toggleActive(id).pipe(
            tap(() => {
                const { availabilities } = this.getState()
                this.setState({
                    availabilities: availabilities.map((a) =>
                        a.id === id ? { ...a, isActive: !a.isActive } : a,
                    ),
                })
            }),
            catchError((error) => {
                console.error('Error toggling active:', error)
                this.setState({ error: true })
                return throwError(() => new Error('Failed to toggle active'))
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    clearDay(dayOfWeek: number) {
        this.setState({ loading: true })
        return this.availabilityApiService.clearDay(dayOfWeek).pipe(
            tap(() => {
                const { availabilities } = this.getState()
                this.setState({
                    availabilities: availabilities.filter(
                        (a) => a.dayOfWeek !== dayOfWeek,
                    ),
                })
            }),
            catchError((error) => {
                console.error('Error clearing day:', error)
                this.setState({ error: true })
                return throwError(() => new Error('Failed to clear day'))
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    replaceAvailability(data: Availability) {
        const { availabilities } = this.getState()
        this.setState({
            availabilities: availabilities.map((a) =>
                a.id === data.id ? data : a,
            ),
        })
    }

    pushAvailability(availability: Availability) {
        this.setState({
            availabilities: [availability, ...this.getState().availabilities],
        })
    }

    private removeAvailabilityFromState(id: string) {
        this.setState({
            availabilities: this.getState().availabilities.filter(
                (a) => a.id !== id,
            ),
        })
    }

    setSelectedAvailabilities(availabilities: Availability[]) {
        this.setState({ selectedAvailabilities: [...availabilities] })
    }

    resetSelectedAvailabilities() {
        this.setState({ selectedAvailabilities: [] })
    }

    setSearch(search: string) {
        this.setState({ search })
    }

    setDayFilter(dayOfWeek?: number) {
        this.setState({ selectedDayFilter: dayOfWeek })
    }
}
