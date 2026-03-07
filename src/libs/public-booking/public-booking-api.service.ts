import { HttpClient, HttpParams } from '@angular/common/http'
import { Inject, Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ENVIRONMENT, EnvironmentConfig } from '../core'
import {
    AvailableDay,
    BookingConfirmation,
    CreatePublicBookingRequest,
    PublicEventType,
    TimeSlot,
} from './public-booking.model'

@Injectable({
    providedIn: 'root',
})
export class PublicBookingApiService {
    private http = inject(HttpClient)

    constructor(
        @Inject(ENVIRONMENT)
        private env: EnvironmentConfig,
    ) {}

    getEventTypeBySlug(username: string, slug: string): Observable<PublicEventType> {
        return this.http.get<PublicEventType>(
            `${this.env.apiUrl}/public/event-types/${username}/${slug}`,
        )
    }

    getAvailableDays(
        eventTypeId: string,
        year: number,
        month: number,
    ): Observable<AvailableDay[]> {
        let params = new HttpParams()
            .set('year', year.toString())
            .set('month', month.toString())

        return this.http.get<AvailableDay[]>(
            `${this.env.apiUrl}/public/availability/${eventTypeId}/available-days`,
            { params },
        )
    }

    getTimeSlots(eventTypeId: string, date: string): Observable<TimeSlot[]> {
        const params = new HttpParams().set('date', date)

        return this.http.get<TimeSlot[]>(
            `${this.env.apiUrl}/public/available-slots/${eventTypeId}/slots`,
            { params },
        )
    }

    createBooking(
        request: CreatePublicBookingRequest,
    ): Observable<BookingConfirmation> {
        return this.http.post<BookingConfirmation>(
            `${this.env.apiUrl}/public/bookings`,
            request,
        )
    }
}