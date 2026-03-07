import { HttpClient, HttpParams } from '@angular/common/http'
import { Inject, Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiService } from '../common-service/lib/api.service'
import { ENVIRONMENT, EnvironmentConfig } from '../core'
import { Availability, AvailabilityDto, UpdateAvailabilityDto } from './availability.model'

@Injectable({
    providedIn: 'root',
})
export class AvailabilityApiService extends ApiService<Availability, AvailabilityDto> {
    constructor(
        @Inject(ENVIRONMENT)
        private env: EnvironmentConfig,
    ) {
        super(inject(HttpClient), `${env.apiUrl}`)
    }

    findAllAvailabilities(query: {
        userId?: string
        dayOfWeek?: number
        isActive?: boolean
        search?: string
    }): Observable<Availability[]> {
        let params = new HttpParams()
        if (query.userId) {
            params = params.set('userId', query.userId)
        }
        if (query.dayOfWeek !== undefined) {
            params = params.set('dayOfWeek', query.dayOfWeek.toString())
        }
        if (query.isActive !== undefined) {
            params = params.set('isActive', query.isActive.toString())
        }
        if (query.search) {
            params = params.set('search', query.search)
        }
        return this.http.get<Availability[]>(this.apiUrl+"/availabilities", { params })
    }

    createAvailability(availability: AvailabilityDto): Observable<Availability> {
        return this.http.post<Availability>(this.apiUrl + "/available-slots", availability)
    }

    updateAvailability(id: string, data: UpdateAvailabilityDto): Observable<Availability> {
        return this.http.put<Availability>(`${this.apiUrl}/${id}`, data)
    }

    toggleActive(id: string): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${id}/toggle-active`, {})
    }

    duplicateDay(dayOfWeek: number): Observable<Availability[]> {
        return this.http.post<Availability[]>(`${this.apiUrl}/duplicate-day`, { dayOfWeek })
    }

    clearDay(dayOfWeek: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/clear-day/${dayOfWeek}`)
    }
}