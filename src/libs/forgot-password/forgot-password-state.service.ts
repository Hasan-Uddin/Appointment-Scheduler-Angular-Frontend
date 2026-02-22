import { Injectable, inject } from '@angular/core'
import { catchError, finalize, tap, throwError } from 'rxjs'
import { SimpleStore } from '../store'
import { ForgotPasswordApiService } from './forgot-password-api.service'

export type ForgotPasswordState = {
    email: string
    loading: boolean
    error: boolean
    errorMessage: string | null
    success: boolean
    successMessage: string | null
    otpVerified: boolean
    resetCompleted: boolean
}

const initialForgotPasswordState: ForgotPasswordState = {
    email: '',
    loading: false,
    error: false,
    errorMessage: null,
    success: false,
    successMessage: null,
    otpVerified: false,
    resetCompleted: false,
}

@Injectable({
    providedIn: 'root',
})
export class ForgotPasswordStateService extends SimpleStore<ForgotPasswordState> {
    private forgotPasswordApiService = inject(ForgotPasswordApiService)

    constructor() {
        super(initialForgotPasswordState)
    }

    // Set email for password reset
    setEmail(email: string) {
        this.setState({
            email,
            error: false,
            errorMessage: null,
            success: false,
            successMessage: null,
        })
    }

    // Send OTP for password reset
    sendOtp() {
        const { email } = this.getState()

        if (!email) {
            this.setState({
                error: true,
                errorMessage: 'Email is required',
            })
            return throwError(() => new Error('Email is required'))
        }

        this.setState({
            loading: true,
            error: false,
            errorMessage: null,
        })

        return this.forgotPasswordApiService.sendOtp(email).pipe(
            tap(() => {
                this.setState({
                    loading: false,
                    success: true,
                    successMessage: 'OTP sent successfully to your email.',
                    otpVerified: false,
                })
            }),
            catchError((error) => {
                this.setState({
                    loading: false,
                    error: true,
                    errorMessage:
                        error.message ||
                        'Failed to send OTP. Please try again.',
                })
                return throwError(() => error)
            }),
            // Remove redundant finalize
        )
    }

    // Verify OTP for password reset
    verifyOtp(otpToken: string) {
        const { email } = this.getState()

        if (!email || !otpToken) {
            this.setState({
                error: true,
                errorMessage: 'Email and OTP are required',
            })
            return throwError(() => new Error('Email and OTP are required'))
        }

        this.setState({
            loading: true,
            error: false,
            errorMessage: null,
        })

        return this.forgotPasswordApiService.verifyOtp(email, otpToken).pipe(
            tap((isValid) => {
                if (isValid) {
                    this.setState({
                        loading: false,
                        success: true,
                        successMessage: 'OTP verified successfully.',
                        otpVerified: true,
                        error: false,
                        errorMessage: null,
                    })
                } else {
                    this.setState({
                        loading: false,
                        error: true,
                        errorMessage: 'Invalid OTP code. Please try again.',
                        otpVerified: false,
                    })
                }
            }),
            catchError((error) => {
                this.setState({
                    loading: false,
                    error: true,
                    errorMessage: error.message || 'Failed to verify OTP.',
                    otpVerified: false,
                })
                return throwError(() => error)
            }),
            // Remove redundant finalize
        )
    }

    // Mark OTP as verified (for use when OTP is verified elsewhere)
    markOtpAsVerified() {
        this.setState({
            otpVerified: true,
            error: false,
            errorMessage: null,
        })
    }

    // Reset password
    resetPassword(newPassword: string, confirmPassword: string) {
        const { email, otpVerified } = this.getState()

        if (!otpVerified) {
            this.setState({
                error: true,
                errorMessage: 'Please verify OTP first',
            })
            return throwError(() => new Error('OTP verification required'))
        }

        if (!email) {
            this.setState({
                error: true,
                errorMessage: 'Email is required',
            })
            return throwError(() => new Error('Email is required'))
        }

        if (!newPassword || !confirmPassword) {
            this.setState({
                error: true,
                errorMessage: 'Password fields cannot be empty',
            })
            return throwError(
                () => new Error('Password fields cannot be empty'),
            )
        }

        if (newPassword !== confirmPassword) {
            this.setState({
                error: true,
                errorMessage: 'Passwords do not match',
            })
            return throwError(() => new Error('Passwords do not match'))
        }

        const request = {
            email,
            newPassword,
            confirmPassword,
        }

        this.setState({
            loading: true,
            error: false,
            errorMessage: null,
        })

        return this.forgotPasswordApiService.resetPassword(request).pipe(
            tap((response) => {
                if (response.success) {
                    this.setState({
                        loading: false,
                        success: true,
                        successMessage:
                            response.message || 'Password reset successfully.',
                        resetCompleted: true,
                        error: false,
                        errorMessage: null,
                    })
                } else {
                    this.setState({
                        loading: false,
                        error: true,
                        errorMessage:
                            response.message || 'Failed to reset password.',
                        resetCompleted: false,
                    })
                }
            }),
            catchError((error) => {
                this.setState({
                    loading: false,
                    error: true,
                    errorMessage: error.message || 'Failed to reset password.',
                    resetCompleted: false,
                })
                return throwError(() => error)
            }),
            // Remove redundant finalize
        )
    }

    // Check if OTP is verified
    isOtpVerified(): boolean {
        return this.getState().otpVerified
    }

    // Check if reset is completed
    isResetCompleted(): boolean {
        return this.getState().resetCompleted
    }

    // Get current email
    getEmail(): string {
        return this.getState().email
    }

    // Clear state
    clearState() {
        this.setState(initialForgotPasswordState)
    }

    // Get loading state
    isLoading(): boolean {
        return this.getState().loading
    }

    // Get error state
    hasError(): boolean {
        return this.getState().error
    }

    // Get error message
    getErrorMessage(): string | null {
        return this.getState().errorMessage
    }

    // Get success message
    getSuccessMessage(): string | null {
        return this.getState().successMessage
    }
}
