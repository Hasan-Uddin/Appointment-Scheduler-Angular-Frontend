import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { MfaSetting } from './mfasetting.model'

@Injectable({
    providedIn: 'root',
})
export class MfaSettingApiService {
    private baseUrl = 'https://api.example.com/mfa-settings'

    constructor(private http: HttpClient) {}

    getAll(): Observable<MfaSetting[]> {
        return this.http.get<MfaSetting[]>(this.baseUrl)
    }

    toggleEnabled(user_name: string): Observable<MfaSetting> {
        return this.http.post<MfaSetting>(
            `${this.baseUrl}/${user_name}/toggle`,
            {},
        )
    }

    update(setting: MfaSetting): Observable<MfaSetting> {
        return this.http.put<MfaSetting>(
            `${this.baseUrl}/${setting.user_name}`,
            setting,
        )
    }
}
