// location-state.service.ts

import { Injectable, inject } from '@angular/core'
import { catchError, finalize, tap, throwError } from 'rxjs'
import { SimpleStore } from '../store'
import { CountryWrapper } from './location.model'
import { LocationApiService } from './location-api.service'

export interface LocationState {
    data: CountryWrapper[]
    loading: boolean
    error: boolean
    loaded: boolean // "cache loaded" flag
}

const initialLocationState: LocationState = {
    data: [],
    loading: false,
    error: false,
    loaded: false,
}

@Injectable()
export class LocationStateService extends SimpleStore<LocationState> {
    private locationApi = inject(LocationApiService)

    constructor() {
        super(initialLocationState)
    }

    init() {
        const { loaded } = this.getState()
        if (loaded) return
        this.loadLocations()
    }

    private loadLocations() {
        this.setState({ loading: true, error: false })

        this.locationApi
            .getAllLocations()
            .pipe(
                tap((data) => {
                    console.log('LOG locations data:', data)

                    this.setState({
                        data,
                        loading: false,
                        loaded: true,
                    })
                }),
                catchError((err) => {
                    this.setState({
                        loading: false,
                        error: true,
                        loaded: false,
                    })
                    return throwError(() => err)
                }),
                finalize(() => {
                    // nothing extra here; loading is already handled
                }),
            )
            .subscribe()
    }

    // simple selectors for components
    selectAllCountries() {
        return this.select('data')
    }

    // synchronous access:
    getAllCountriesSnapshot(): CountryWrapper[] {
        return this.getState().data
    }
}
