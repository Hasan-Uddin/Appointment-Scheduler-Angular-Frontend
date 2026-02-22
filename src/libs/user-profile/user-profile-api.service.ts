import { HttpClient, HttpParams } from '@angular/common/http'
import { Inject, Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiService } from '../common-service/lib/api.service'
import { ENVIRONMENT, EnvironmentConfig } from '../core'
import { UserProfile, UserProfileDto } from './user-profile.model'

@Injectable({
    providedIn: 'root',
})
export class UserProfileApiService extends ApiService<
    UserProfile,
    UserProfileDto
> {
    constructor(
        @Inject(ENVIRONMENT)
        private env: EnvironmentConfig,
    ) {
        super(inject(HttpClient), `${env.apiUrl}/users`)
    }

    getUserProfileById(userId: string): Observable<UserProfile> {
        return this.http.get<UserProfile>(this.apiUrl + '/' + userId)
    }
}
