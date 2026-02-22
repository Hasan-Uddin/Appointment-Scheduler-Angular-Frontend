import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { EmailVerification } from './emailVerification.model'

@Injectable({
    providedIn: 'root',
})
export class EmailVerificationDataService {
    private verifications: EmailVerification[] = [
        {
            id: 1n,
            user_id: 1n,
            token: 'abc123verificationtoken',
            expires_at: '2025-12-01T12:00:00Z',
            verified_at: undefined,
        },
        {
            id: 2n,
            user_id: 2n,
            token: 'def456verificationtoken',
            expires_at: '2025-12-05T12:00:00Z',
            verified_at: '2025-11-21T10:00:00Z',
        },
    ]

    constructor() {}

    getAll(): Observable<EmailVerification[]> {
        return of(this.verifications)
    }

    create(verification: EmailVerification): Observable<EmailVerification> {
        const newId = this.verifications.length
            ? Math.max(...this.verifications.map((v) => Number(v.id))) + 1
            : 1
        verification.id = BigInt(newId)
        this.verifications.push(verification)
        return of(verification)
    }

    update(
        id: bigint,
        verification: EmailVerification,
    ): Observable<EmailVerification> {
        const index = this.verifications.findIndex((v) => v.id === id)
        if (index !== -1) this.verifications[index] = verification
        return of(verification)
    }

    delete(id: bigint): Observable<void> {
        this.verifications = this.verifications.filter((v) => v.id !== id)
        return of(undefined)
    }

    findByToken(token: string): EmailVerification | undefined {
        return this.verifications.find((v) => v.token === token)
    }

    verifyToken(id: bigint): boolean {
        const verification = this.verifications.find((v) => v.id === id)
        if (verification && !verification.verified_at) {
            verification.verified_at = new Date().toISOString()
            return true
        }
        return false
    }
}
