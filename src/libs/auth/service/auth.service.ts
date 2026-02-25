import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs'
import { environment } from '../../../environments/environment'
import { ContextUserStorageService } from './contextUser-storage.service'
import { UserInfo } from './user-info.model'

@Injectable({ providedIn: 'root' })
export class AuthService {
    private authState$ = new BehaviorSubject<boolean | null>(null)
    private redirecting = false
    private router = inject(Router)
    private http = inject(HttpClient)
    private authApiUrl = `${environment.authApiUrl}`
    private userStorage = inject(ContextUserStorageService)

    isLoggedIn(): Observable<boolean> {
        return this.http
            .get<UserInfo>(`${this.authApiUrl}/me`, { withCredentials: true })
            .pipe(
                tap((user) => {
                    this.userStorage.saveUserInfo({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        pictureUrl: user.pictureUrl,
                    })
                }),
                map(() => true),
                catchError((err) => {
                    if (err.status === 401) {
                        return of(false)
                    }
                    if (err.status === 0) {
                        console.error('Backend offline')
                        return of(false)
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
