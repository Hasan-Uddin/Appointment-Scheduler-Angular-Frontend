import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { MfaLog } from './mfalog.model'

@Injectable({
    providedIn: 'root',
})
export class MfaApiService {
    private baseUrl = 'https://api.example.com/mfa-logs' // Backend URL

    constructor(private http: HttpClient) {}

    getAll(): Observable<MfaLog[]> {
        return this.http.get<MfaLog[]>(this.baseUrl)
    }

    getById(id: number): Observable<MfaLog> {
        return this.http.get<MfaLog>(`${this.baseUrl}/${id}`)
    }

    create(log: MfaLog): Observable<MfaLog> {
        return this.http.post<MfaLog>(this.baseUrl, log)
    }

    update(id: number, log: MfaLog): Observable<MfaLog> {
        return this.http.put<MfaLog>(`${this.baseUrl}/${id}`, log)
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`)
    }
}
