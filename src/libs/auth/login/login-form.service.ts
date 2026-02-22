import { Injectable, inject } from '@angular/core'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { LoginRequest } from './login.model'

@Injectable()
export class LoginFormService {
    private fb = inject(NonNullableFormBuilder)
    form = this.buildForm()

    buildForm(): FormGroup {
        const { required, minLength, pattern } = Validators

        return this.fb.group({
            //phone: ['', [required, pattern(/^\d{11}$/)]],
            email: [
                '',
                [
                    required,
                    pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
                ],
            ],
            password: ['', [required]],
            rememberMe: [false],
        })
    }

    controls(control: string) {
        return this.form.get(control)
    }

    getValue() {
        return this.form.getRawValue()
    }

    patchForm(data: LoginRequest) {
        this.form.patchValue(data)
    }
}
