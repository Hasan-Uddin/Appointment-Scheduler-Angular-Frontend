import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { EmailVerification } from './emailVerification.model'
import { EmailVerificationDataService } from './emailVerification-data.service'

@Injectable({
    providedIn: 'root',
})
export class EmailVerificationStateService {
    private verificationsSubject = new BehaviorSubject<EmailVerification[]>([])
    verifications$ = this.verificationsSubject.asObservable()

    constructor(private dataService: EmailVerificationDataService) {}

    loadVerifications() {
        this.dataService
            .getAll()
            .subscribe((data) => this.verificationsSubject.next(data))
    }

    addVerification(v: EmailVerification) {
        this.dataService.create(v).subscribe((newV) => {
            const current = this.verificationsSubject.getValue()
            this.verificationsSubject.next([...current, newV])
        })
    }

    updateVerification(id: bigint, v: EmailVerification) {
        this.dataService.update(id, v).subscribe((updated) => {
            const current = this.verificationsSubject
                .getValue()
                .map((item) => (item.id === id ? updated : item))
            this.verificationsSubject.next(current)
        })
    }

    deleteVerification(id: bigint) {
        this.dataService.delete(id).subscribe(() => {
            const current = this.verificationsSubject
                .getValue()
                .filter((item) => item.id !== id)
            this.verificationsSubject.next(current)
        })
    }

    verifyToken(id: bigint) {
        if (this.dataService.verifyToken(id)) {
            this.loadVerifications()
        }
    }
}
