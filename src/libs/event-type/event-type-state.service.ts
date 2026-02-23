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
import { EventType, UpdateEventTypeDto } from './event-type.model'
import { EventTypeApiService } from './event-type-api.service'

export type EventTypeState = {
    eventTypes: EventType[]
    selectedEventTypes: EventType[]
    loading: boolean
    error: boolean
    selectedId: string
    search?: string
    isActive?: boolean
}

const initialEventTypeState: EventTypeState = {
    eventTypes: [],
    selectedEventTypes: [],
    loading: false,
    error: false,
    selectedId: '',
    search: '',
    isActive: undefined,
}

@Injectable()
export class EventTypeStateService extends SimpleStore<EventTypeState> {
    eventTypeApiService = inject(EventTypeApiService)

    constructor() {
        super(initialEventTypeState)
    }

    init() {
        this.continueLoadingEventTypes()
    }

    private continueLoadingEventTypes() {
        combineLatest([
            this.select('search'),
            this.select('selectedId'),
            this.select('isActive'),
        ])
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => this.setState({ loading: true })),
                switchMap(([search, selectedId, isActive]) =>
                    this.eventTypeApiService.findAllEventTypes({
                        search,
                        selectedId,
                        isActive,
                    }),
                ),
            )
            .subscribe({
                next: (res) => {
                    this.setState({
                        loading: false,
                        eventTypes: res,
                    })
                },
                error: () => {
                    this.setState({ loading: false, error: true })
                },
            })
    }

    deleteEventType(id: string) {
        this.setState({ loading: true })
        return this.eventTypeApiService.delete(id).pipe(
            tap(() => this.removeEventTypeFromState(id)),
            catchError((error) => {
                console.error('Error deleting event type:', error)
                this.setState({ error: true })
                return throwError(() => new Error('Failed to delete event type'))
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    updateEventType(id: string, data: UpdateEventTypeDto) {
        const { eventTypes } = this.getState()
        this.setState({ loading: true })
        const current = eventTypes.find((et) => et.id === id)
        const merged: EventType = { ...current!, ...data }

        return this.eventTypeApiService.updateEventType(id, data).pipe(
            tap(() => this.replaceEventType(merged)),
            catchError((error) => {
                console.error('Error updating event type:', error)
                this.setState({ error: true })
                return throwError(() => new Error('Failed to update event type'))
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    toggleActive(id: string) {
        this.setState({ loading: true })
        return this.eventTypeApiService.toggleActive(id).pipe(
            tap(() => {
                const { eventTypes } = this.getState()
                this.setState({
                    eventTypes: eventTypes.map((et) =>
                        et.id === id ? { ...et, isActive: !et.isActive } : et,
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

    duplicateEventType(id: string) {
        this.setState({ loading: true })
        return this.eventTypeApiService.duplicateEventType(id).pipe(
            tap((newEventType) => this.pushEventType(newEventType)),
            catchError((error) => {
                console.error('Error duplicating event type:', error)
                this.setState({ error: true })
                return throwError(() => new Error('Failed to duplicate event type'))
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    replaceEventType(data: EventType) {
        const { eventTypes } = this.getState()
        this.setState({
            eventTypes: eventTypes.map((et) => (et.id === data.id ? data : et)),
        })
    }

    pushEventType(eventType: EventType) {
        this.setState({
            eventTypes: [eventType, ...this.getState().eventTypes],
        })
    }

    private removeEventTypeFromState(id: string) {
        this.setState({
            eventTypes: this.getState().eventTypes.filter((et) => et.id !== id),
        })
    }

    setSelectedEventTypes(eventTypes: EventType[]) {
        this.setState({ selectedEventTypes: [...eventTypes] })
    }

    resetSelectedEventTypes() {
        this.setState({ selectedEventTypes: [] })
    }

    setSearch(search: string) {
        this.setState({ search })
    }

    setActiveFilter(isActive?: boolean) {
        this.setState({ isActive })
    }
}