import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import {
    ForgotPassword,
    ForgotPasswordRequestDto,
} from './forgot-password.model'

export interface OtpResponse {
    success: boolean
    message: string
}

export interface OtpVerificationResponse {
    isValid: boolean
    message?: string
}

@Injectable({
    providedIn: 'root',
})
export class ForgotPasswordApiService {
    private env = environment

    constructor(private http: HttpClient) {}

    sendOtp(email: string): Observable<OtpResponse> {
        return this.http.post<OtpResponse>(
            `${this.env.apiUrl}/otp-request`,
            { input: email },
            { headers: { 'Content-Type': 'application/json' } },
        )
    }

    verifyOtp(
        email: string,
        otpToken: string,
    ): Observable<OtpVerificationResponse> {
        return this.http.post<OtpVerificationResponse>(
            `${this.env.apiUrl}/otp-verify`,
            {
                input: email,
                otpToken: otpToken,
            },
            { headers: { 'Content-Type': 'application/json' } },
        )
    }

    resetPassword(
        request: ForgotPasswordRequestDto,
    ): Observable<ForgotPassword> {
        return this.http.post<ForgotPassword>(
            `${this.env.apiUrl}/users/forgot-password-reset`,
            request,
            { headers: { 'Content-Type': 'application/json' } },
        )
    }
}
