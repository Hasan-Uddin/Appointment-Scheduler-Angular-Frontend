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
import { Booking } from './booking.model'
import { BookingApiService } from './booking-api.service'

export type BookingState = {
    bookings: Booking[]
    selectedBookings: Booking[]
    loading: boolean
    error: boolean
    selectedId: string
    search?: string
    orderBy?: string
}

const initialBookingState: BookingState = {
    bookings: [],
    selectedBookings: [],
    loading: false,
    error: false,
    selectedId: '',
    search: '',
    orderBy: '',
}

@Injectable()
export class BookingListStateService extends SimpleStore<BookingState> {
    bookingApiService = inject(BookingApiService)

    constructor() {
        super(initialBookingState)
    }

    init() {
        this.continueLoadingBookings()
    }

    private continueLoadingBookings() {
        combineLatest([
            this.select('search'),
            this.select('selectedId'),
        ])
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => this.setState({ loading: true })),
                switchMap(([search, selectedId]) =>
                    this.bookingApiService.findAllBookings({
                        search,
                        selectedId,
                    }),
                ),
            )
            .subscribe({
                next: (res) => {
                    this.setState({
                        loading: false,
                        bookings: res,
                    })
                },
                error: () => {
                    this.setState({ loading: false, error: true })
                },
            })
    }

    deleteBooking(id: string) {
        this.setState({ loading: true })
        return this.bookingApiService.delete(id).pipe(
            tap(() => this.removeBookingFromState(id)),
            catchError((error) => {
                console.error('Error deleting booking:', error)
                this.setState({ error: true })
                return throwError(() => new Error('Failed to delete booking'))
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    replaceBooking(data: Booking) {
        const { bookings } = this.getState()
        this.setState({
            bookings: bookings.map((b) => (b.id === data.id ? data : b)),
        })
    }

    updateBooking(id: string, data: Booking) {
        const { bookings } = this.getState()
        this.setState({ loading: true })
        const current = bookings.find((b) => b.id === id)
        const merged: Booking = { ...current, ...data }

        return this.bookingApiService.update(id, data).pipe(
            tap(() => this.replaceBooking(merged)),
            catchError((error) => {
                console.error('Error updating booking:', error)
                this.setState({ error: true })
                return throwError(() => new Error('Failed to update booking'))
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    pushBooking(booking: Booking) {
        this.setState({
            bookings: [booking, ...this.getState().bookings],
        })
    }

    private removeBookingFromState(id: string) {
        this.setState({
            bookings: this.getState().bookings.filter((b) => b.id !== id),
        })
    }

    setSelectedBookings(bookings: Booking[]) {
        this.setState({ selectedBookings: [...bookings] })
    }

    resetSelectedBookings() {
        this.setState({ selectedBookings: [] })
    }
}