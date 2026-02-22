import { Injectable } from '@angular/core'
import { AbstractControl } from '@angular/forms'

@Injectable({ providedIn: 'root' })
export class FormValidationErrorsService {
    getErrorMsg(control: AbstractControl | null): string | null {
        if (!control || !control.errors) return null
        const errors = control.errors

        if (errors['required']) return 'This field is required'
        if (errors['email']) return 'Invalid email'
        if (errors['pattern']) return 'Invalid format'
        if (errors['minlength'])
            return `Minimum ${errors['minlength'].requiredLength} characters required`
        if (errors['maxlength'])
            return `Maximum ${errors['maxlength'].requiredLength} characters allowed`
        if (errors['passwordMismatch']) return 'Passwords do not match'
        if (errors['requiredTrue']) return 'Must agree'

        return null
    }
}
