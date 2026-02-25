import { Injectable, inject } from '@angular/core'
import { catchError, of } from 'rxjs'
import { SimpleStore } from '../store'
import {
    AvailableDay,
    PublicEventType,
    TimeSlot,
} from './public-booking.model'
import { PublicBookingApiService } from './public-booking-api.service'

export type PublicBookingState = {
    eventType: PublicEventType | null
    availableDays: AvailableDay[]
    timeSlots: TimeSlot[]
    selectedDate: string | null
    selectedSlot: TimeSlot | null
    currentMonth: Date
    loading: boolean
    error: boolean
    errorMessage?: string
}

const initialState: PublicBookingState = {
    eventType: null,
    availableDays: [],
    timeSlots: [],
    selectedDate: null,
    selectedSlot: null,
    currentMonth: new Date(),
    loading: false,
    error: false,
    errorMessage: '',
}

@Injectable()
export class PublicBookingStateService extends SimpleStore<PublicBookingState> {
    private api = inject(PublicBookingApiService)

    constructor() {
        super(initialState)
    }

    init(username: string, slug: string) {
        this.setState({ ...this.getState(), loading: true, error: false })

        this.api
            .getEventTypeBySlug(username, slug)
            .pipe(
                catchError((err) => {
                    console.error('Load event type failed:', err)
                    this.setState({
                        ...this.getState(),
                        loading: false,
                        error: true,
                        errorMessage: 'Event not found or is inactive.',
                    })
                    return of(null)
                }),
            )
            .subscribe((eventType) => {
                if (!eventType) return

                this.setState({
                    ...this.getState(),
                    eventType,
                    loading: false,
                })

                this.loadAvailableDays()
            })
    }

    loadAvailableDays() {
        const state = this.getState()
        if (!state.eventType) return

        const year = state.currentMonth.getFullYear()
        const month = state.currentMonth.getMonth() + 1

        this.setState({ ...state, loading: true })

        this.api
            .getAvailableDays(state.eventType.id, year, month)
            .pipe(
                catchError((err) => {
                    console.error('Load days failed:', err)
                    this.setState({
                        ...this.getState(),
                        loading: false,
                    })
                    return of([])
                }),
            )
            .subscribe((days) => {
                this.setState({
                    ...this.getState(),
                    availableDays: days,
                    loading: false,
                })
            })
    }

    loadTimeSlots(date: string) {
        const state = this.getState()
        if (!state.eventType) return

        this.setState({ ...state, loading: true })

        this.api
            .getTimeSlots(state.eventType.id, date)
            .pipe(
                catchError((err) => {
                    console.error('Load slots failed:', err)
                    this.setState({
                        ...this.getState(),
                        loading: false,
                    })
                    return of([])
                }),
            )
            .subscribe((slots) => {
                this.setState({
                    ...this.getState(),
                    timeSlots: slots,
                    loading: false,
                })
            })
    }

    selectDate(date: string) {
        const state = this.getState()
        this.setState({
            ...state,
            selectedDate: date,
            selectedSlot: null,
            timeSlots: [],
        })
        this.loadTimeSlots(date)
    }

    selectSlot(slot: TimeSlot) {
        const state = this.getState()
        this.setState({
            ...state,
            selectedSlot: slot,
        })
    }

    backToDateSelection() {
        const state = this.getState()
        this.setState({
            ...state,
            selectedDate: null,
            selectedSlot: null,
            timeSlots: [],
        })
    }

    backToTimeSelection() {
        const state = this.getState()
        this.setState({
            ...state,
            selectedSlot: null,
        })
    }

    goToNextMonth() {
        const state = this.getState()
        const next = new Date(state.currentMonth)
        next.setMonth(next.getMonth() + 1)

        this.setState({ ...state, currentMonth: next })
        this.loadAvailableDays()
    }

    goToPreviousMonth() {
        const state = this.getState()
        const prev = new Date(state.currentMonth)
        prev.setMonth(prev.getMonth() - 1)

        this.setState({ ...state, currentMonth: prev })
        this.loadAvailableDays()
    }

    getCurrentStep(): 'date' | 'time' | 'form' {
        const state = this.getState()
        if (!state.selectedDate) return 'date'
        if (!state.selectedSlot) return 'time'
        return 'form'
    }
}