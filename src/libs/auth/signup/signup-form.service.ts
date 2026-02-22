import { Injectable, inject } from '@angular/core'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { FormValidationErrorsService } from '../../common-service/lib/form-validation-errors.service'
import { passwordMatchValidator } from '../../common-service/lib/password-match.validator'
import { SignUpRequest } from './signup.model'

@Injectable()
export class SignUpFormService {
    private fb = inject(NonNullableFormBuilder)
    private formError = inject(FormValidationErrorsService)
    form = this.buildForm()

    buildForm(): FormGroup {
        const { required, email, minLength, pattern, maxLength, requiredTrue } =
            Validators

        return this.fb.group(
            {
                fullName: [
                    '',
                    [
                        required,
                        minLength(3),
                        pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/),
                    ],
                ],
                phone: [
                    '',
                    [
                        required,
                        minLength(11),
                        maxLength(13),
                        pattern(/^[0-9]+$/),
                    ],
                ],
                email: ['', [required, email]],
                password: [
                    '',
                    [
                        required,
                        minLength(8),
                        // pattern(/[A-Z]/),  // at least one uppercase
                        // pattern(/[a-z]/), // at least one lowercase
                        // pattern(/[0-9]/), // at least one number
                        // pattern(/[^A-Za-z0-9]/), // at least one special char
                    ],
                ],
                confirmPassword: ['', [required, minLength(8)]],
            },
            {
                validators: passwordMatchValidator(),
            },
        )
    }

    controls(control: string) {
        return this.form.get(control)
    }

    getValue() {
        return this.form.getRawValue()
    }

    patchForm(data: SignUpRequest) {
        this.form.patchValue(data)
    }

    getErrorMsg(name: string): string | null {
        return this.formError.getErrorMsg(this.controls(name))
    }
}
