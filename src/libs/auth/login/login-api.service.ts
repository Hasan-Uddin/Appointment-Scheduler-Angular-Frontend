import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { catchError, Observable, tap, throwError } from 'rxjs'
import { dashboardRoutes } from '../../../app/pages/dashboard/dashboard.route'
import { environment } from '../../../environments/environment'
import { AuthService } from '../service/auth.service'
import { ContextUserStorageService } from '../service/contextUser-storage.service'
import { TokenStorageService } from '../service/token-storage.service'
import { LoginRequest, LoginResponse } from './login.model'

@Injectable({
    providedIn: 'root',
})
export class LoginApiService {
    // Modern dependency injection
    private router = inject(Router)
    private route = inject(ActivatedRoute)
    private http = inject(HttpClient)
    private tokenStorageService = inject(TokenStorageService)
    private contextUserStorageService = inject(ContextUserStorageService)
    private authService = inject(AuthService)
    private apiUrl = `${environment.apiUrl}`

    login(payload: LoginRequest): Observable<LoginResponse | string> {
        return this.http
            .post<LoginResponse | string>(
                `${this.apiUrl}/user/signin`,
                payload,
                { withCredentials: true }, // cookies
            )
            .pipe(
                tap((response) => this.handleLoginResponse(response)),
                catchError((error) => {
                    this.authService.logout()
                    return this.handleLoginError(error)
                }),
            )
    }

    private handleLoginResponse(response: LoginResponse | string): void {
        this.authService.setAuthenticated()
        if (typeof response === 'string') {
            // tmp
            // only Token as raw string
            this.tokenStorageService.saveAccessToken(response)
            return
        }
        if (response?.token) {
            this.tokenStorageService.saveAccessToken(response.token)
        }
        if (response?.refreshToken) {
            this.tokenStorageService.saveRefreshToken(response.refreshToken)
        }
        if (response?.user?.id) {
            this.contextUserStorageService.saveContextUserId(response.user.id)
        }
        if (response?.user?.roleCode) {
            this.contextUserStorageService.saveContextUserRole(
                response.user.roleCode,
            )
        }

        const returnUrl = this.route.snapshot.queryParams['ReturnUrl']

        if (returnUrl && returnUrl.startsWith('/')) {
            const baseUrl = this.apiUrl.replace(/\/api$/, '')
            window.location.href = baseUrl + returnUrl
        } else {
            this.router.navigate([dashboardRoutes.user]) // Default fallback
        }
    }

    private handleLoginError(error: unknown) {
        if (error instanceof HttpErrorResponse) {
            return throwError(() => error)
        }
        return throwError(() => new Error('Unknown login error'))
    }
}
