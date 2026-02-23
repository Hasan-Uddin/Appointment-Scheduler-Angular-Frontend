import { HttpClient, HttpParams } from '@angular/common/http'
import { Inject, Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiService } from '../common-service/lib/api.service'
import { ENVIRONMENT, EnvironmentConfig } from '../core'
import { Booking, BookingDto } from './booking.model'

@Injectable({
    providedIn: 'root',
})
export class BookingApiService extends ApiService<Booking, BookingDto> {
    constructor(
        @Inject(ENVIRONMENT)
        private env: EnvironmentConfig,
    ) {
        super(inject(HttpClient), `${env.apiUrl}/bookings`)
    }

    findAllBookings(query: {
        status?: string
        search?: string
        selectedId?: string
    }): Observable<Booking[]> {
        let params = new HttpParams()
        if (query.search) {
            params = params.set('search', query.search)
        }
        if (query.status) {
            params = params.set('status', query.status)
        }
        if (query.selectedId) {
            params = params.set('selectedId', query.selectedId)
        }
        return this.http.get<Booking[]>(this.apiUrl, { params })
    }

    createNewBooking(booking: BookingDto): Observable<Booking> {
        return this.http.post<Booking>(this.apiUrl, booking)
    }
}