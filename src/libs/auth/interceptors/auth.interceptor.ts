import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, throwError } from 'rxjs'
import { AuthService } from '../service/auth.service'

export const AuthInterceptorFn: HttpInterceptorFn = (request, next) => {
    const auth = inject(AuthService)

    const req = request.clone({
        withCredentials: true,
    })

    return next(req).pipe(
        catchError((err) => {
            const isAuthApiCall =
                request.url.includes('/login') ||
                request.url.includes('/logout') ||
                request.url.includes('/me')

            if (err.status === 401 && !isAuthApiCall) {
                auth.handleUnauthorized()
            }
            return throwError(() => err)
        }),
    )
}
