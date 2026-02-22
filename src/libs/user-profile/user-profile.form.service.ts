import { Injectable } from '@angular/core'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { UserProfile } from './user-profile.model'

@Injectable({
    providedIn: 'root',
})
export class UserProfileFormService {
    form: FormGroup
    constructor(private fb: NonNullableFormBuilder) {
        this.form = this.buildForm()
    }

    buildForm(): FormGroup {
        const { required, minLength, email, pattern } = Validators
        return this.fb.group({
            email: ['', [required, email]],
            fullName: [
                '',
                [required, minLength(3), pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/)],
            ],
            phone: ['', [required, minLength(11), pattern(/^[0-9]+$/)]],
            role: ['', []],
            countryId: [null, Validators.required],
            regionId: [null, Validators.required],
            districtId: [null, Validators.required],
            subDistrictId: [null, Validators.required],
            address: [null, Validators.required],
        })
    }

    controls(control: string) {
        return this.form.get(control)
    }

    getValue() {
        return this.form.getRawValue()
    }

    patchForm(data: UserProfile) {
        this.form.patchValue(data)
    }
}
