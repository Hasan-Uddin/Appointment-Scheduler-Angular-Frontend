import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { catchError, Observable, tap, throwError } from 'rxjs'
import { environment } from '../../../environments/environment'
import { AuthService } from '../service/auth.service'
import { SignUpRequest } from './signup.model'
// import { TokenStorageService } from '../token/token-storage.service';

@Injectable({ providedIn: 'root' })
export class SignupApiService {
    private http = inject(HttpClient)
    private authService = inject(AuthService)
    private apiUrl = `${environment.apiUrl}`
    //   private storage = inject(TokenStorageService);

    signup(payload: SignUpRequest): Observable<any> {
        return this.http
            .post<SignUpRequest>(`${this.apiUrl}/user/signup`, payload)
            .pipe(
                tap((response) => this.handleSignUpResponse(response)),
                catchError((error) => {
                    return this.handleSignUpError(error)
                }),
            )
    }

    private handleSignUpResponse(response: SignUpRequest): void {
        // handle response here
    }

    private handleSignUpError(error: unknown) {
        if (error instanceof HttpErrorResponse) {
            if (error.status === 409) {
                return throwError(
                    () =>
                        new HttpErrorResponse({
                            error: { message: 'Account already exists' },
                        }),
                )
            }
            return throwError(() => error)
        }
        return throwError(() => new Error('Unknown Signup error'))
    }
}
