import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs'
import { environment } from '../../../environments/environment'

@Injectable({ providedIn: 'root' })
export class AuthService {
    private authState$ = new BehaviorSubject<boolean | null>(null)
    private redirecting = false
    private router = inject(Router)
    private http = inject(HttpClient)
    private authApiUrl = `${environment.authApiUrl}`

    isLoggedIn(): Observable<boolean> {
        return this.http
            .get(`${this.authApiUrl}/me`, { withCredentials: true })
            .pipe(
                map(() => true),
                catchError((err) => {
                    if (err.status === 401) {
                        return of(false) // user not logged in
                    }
                    if (err.status === 0) {
                        console.error('Backend offline')
                        return of(false)
                        // or handle differently — but DO NOT trigger login
                    }
                    return of(false)
                }),
            )
    }

    logout() {
        this.http
            .post(`${this.authApiUrl}/logout`, {}, { withCredentials: true })
            .subscribe(() => {
                this.authState$.next(false)
                this.router.navigate(['/'])
            })
    }

    setAuthenticated() {
        this.redirecting = false
        this.authState$.next(true)
    }

    handleUnauthorized() {
        if (this.redirecting) return
        this.redirecting = true
        this.authState$.next(false)
        this.router.navigate(['/'])
    }
}
