import { Injectable } from '@angular/core'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'

@Injectable({
    providedIn: 'root',
})
export class PublicBookingFormService {
    form: FormGroup

    constructor(private fb: NonNullableFormBuilder) {
        this.form = this.buildForm()
    }

    private buildForm(): FormGroup {
        const { required, email, maxLength, pattern } = Validators
        return this.fb.group({
            guestName: ['', [required, maxLength(100)]],
            guestEmail: ['', [required, email, maxLength(255)]],
            guestPhone: ['', [pattern(/^[0-9+\-\s()]*$/)]],
            notes: ['', [maxLength(500)]],
        })
    }

    controls(control: string) {
        return this.form.get(control)
    }

    getValue() {
        return this.form.getRawValue()
    }

    reset() {
        this.form.reset()
    }

    isValid(): boolean {
        return this.form.valid
    }

    markAllAsTouched() {
        this.form.markAllAsTouched()
    }

    saveGuestInfo() {
        try {
            const value = this.getValue()
            localStorage.setItem(
                'booking_guest_info',
                JSON.stringify({
                    guestName: value.guestName,
                    guestEmail: value.guestEmail,
                }),
            )
        } catch {}
    }

    loadGuestInfo() {
        try {
            const saved = localStorage.getItem('booking_guest_info')
            if (!saved) return
            const data = JSON.parse(saved)
            this.form.patchValue({
                guestName: data.guestName ?? '',
                guestEmail: data.guestEmail ?? '',
            })
        } catch {}
    }
}