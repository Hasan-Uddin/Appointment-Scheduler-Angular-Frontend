import { Injectable } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    NonNullableFormBuilder,
    Validators,
} from '@angular/forms'
import { AbstractFormService } from '../common-service/lib/abstract-form.service'
import { Todo, TodoDto } from './todo.model'
import { TodoApiService } from './todo-api.service'

@Injectable({
    providedIn: 'root',
})
export class TodoFormService {
    form: FormGroup
    constructor(private fb: NonNullableFormBuilder) {
        this.form = this.buildForm()
    }

    buildForm(): FormGroup {
        const { required, minLength } = Validators
        return this.fb.group({
            userId: ['', [required]],
            title: ['', [required, minLength(3)]],
            body: ['', [required, minLength(3)]],
        })
    }

    controls(control: string) {
        return this.form.get(control)
    }

    getValue() {
        return this.form.getRawValue()
    }

    patchForm(data: Todo) {
        this.form.patchValue(data)
    }
}
