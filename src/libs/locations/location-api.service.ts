import { HttpClient } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ENVIRONMENT, EnvironmentConfig } from '../core'
import { CountryWrapper } from './location.model'

@Injectable({
    providedIn: 'root',
})
export class LocationApiService {
    private readonly apiUrl: string

    constructor(
        private http: HttpClient,
        @Inject(ENVIRONMENT) private env: EnvironmentConfig,
    ) {
        this.apiUrl = `${env.apiUrl}/locations`
    }

    getAllLocations(): Observable<CountryWrapper[]> {
        return this.http.get<CountryWrapper[]>(this.apiUrl)
    }
}
