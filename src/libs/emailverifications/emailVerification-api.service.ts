import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { EmailVerification } from './emailVerification.model'

@Injectable({
    providedIn: 'root',
})
export class EmailVerificationApiService {
    private baseUrl = 'https://api.example.com/email-verifications'

    constructor(private http: HttpClient) {}

    getAll(): Observable<EmailVerification[]> {
        return this.http.get<EmailVerification[]>(this.baseUrl)
    }

    getById(id: bigint): Observable<EmailVerification> {
        return this.http.get<EmailVerification>(`${this.baseUrl}/${id}`)
    }

    create(v: EmailVerification): Observable<EmailVerification> {
        return this.http.post<EmailVerification>(this.baseUrl, v)
    }

    update(id: bigint, v: EmailVerification): Observable<EmailVerification> {
        return this.http.put<EmailVerification>(`${this.baseUrl}/${id}`, v)
    }

    delete(id: bigint): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`)
    }

    verifyToken(id: bigint): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseUrl}/${id}/verify`, {})
    }
}
