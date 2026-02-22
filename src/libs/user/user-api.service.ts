import { HttpClient, HttpParams } from '@angular/common/http'
import { Inject, Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiService } from '../common-service/lib/api.service'
import { ENVIRONMENT, EnvironmentConfig } from '../core'
import { User, UserDto } from '../user'

@Injectable({
    providedIn: 'root',
})
export class UserApiService extends ApiService<User, UserDto> {
    constructor(
        @Inject(ENVIRONMENT)
        private env: EnvironmentConfig,
    ) {
        super(inject(HttpClient), `${env.apiUrl}/users`) // for eg. https://authapi.dapplesoft.com/api/users
    }

    findAllUsers(query: {
        status?: string
        search?: string
        selectedId?: string
        page?: number
        size?: number
    }): Observable<User[]> {
        let params = new HttpParams()
        if (query.search) {
            params = params.set('search', query.search)
        }
        if (query.status) {
            params = params.set('selectedId', query.status)
        }
        if (query.page) {
            params = params.set('page', query.page)
        }
        if (query.size) {
            params = params.set('page', query.size)
        }
        return this.http.get<User[]>(this.apiUrl)
    }

    createNewUser(user: UserDto): Observable<User> {
        return this.http.post<User>(this.apiUrl, user)
    }
}
