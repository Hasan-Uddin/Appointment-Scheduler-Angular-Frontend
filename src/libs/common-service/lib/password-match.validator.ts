import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function passwordMatchValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
        const password = form.get('password')?.value
        const confirmPassword = form.get('confirmPassword')?.value

        if (!password || !confirmPassword) return null

        return password === confirmPassword ? null : { passwordMismatch: true }
    }
}
