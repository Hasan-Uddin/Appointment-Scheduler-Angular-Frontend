import { HttpClient, HttpParams } from '@angular/common/http'
import { Inject, Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiService } from '../common-service/lib/api.service'
import { ENVIRONMENT, EnvironmentConfig } from '../core'
import { EventType, EventTypeDto, UpdateEventTypeDto } from './event-type.model'

@Injectable({
    providedIn: 'root',
})
export class EventTypeApiService extends ApiService<EventType, EventTypeDto> {
    constructor(
        @Inject(ENVIRONMENT)
        private env: EnvironmentConfig,
    ) {
        super(inject(HttpClient), `${env.apiUrl}/event-types`)
    }

    findAllEventTypes(query: {
        search?: string
        isActive?: boolean
        selectedId?: string
    }): Observable<EventType[]> {
        let params = new HttpParams()
        if (query.search) {
            params = params.set('search', query.search)
        }
        if (query.isActive !== undefined) {
            params = params.set('isActive', query.isActive.toString())
        }
        if (query.selectedId) {
            params = params.set('selectedId', query.selectedId)
        }
        return this.http.get<EventType[]>(this.apiUrl, { params })
    }

    createEventType(eventType: EventTypeDto): Observable<EventType> {
        return this.http.post<EventType>(this.apiUrl, eventType)
    }

    updateEventType(id: string, data: UpdateEventTypeDto): Observable<EventType> {
        return this.http.put<EventType>(`${this.apiUrl}/${id}`, data)
    }

    toggleActive(id: string): Observable<void> {
        return this.http.patch<void>(`${this.apiUrl}/${id}/toggle-active`, {})
    }

    getBySlug(slug: string): Observable<EventType> {
        return this.http.get<EventType>(`${this.apiUrl}/slug/${slug}`)
    }

    duplicateEventType(id: string): Observable<EventType> {
        return this.http.post<EventType>(`${this.apiUrl}/${id}/duplicate`, {})
    }
}