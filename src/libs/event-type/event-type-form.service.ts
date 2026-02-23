import { Injectable } from '@angular/core'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { EventType } from './event-type.model'

@Injectable({
    providedIn: 'root',
})
export class EventTypeFormService {
    form: FormGroup

    constructor(private fb: NonNullableFormBuilder) {
        this.form = this.buildForm()
    }

    buildForm(): FormGroup {
        const { required, maxLength, min, max, pattern } = Validators
        return this.fb.group({
            name: ['', [required, maxLength(100)]],
            slug: ['', [required, pattern(/^[a-z0-9-]+$/), maxLength(100)]],
            description: ['', [maxLength(500)]],
            durationMinutes: [30, [required, min(5), max(480)]],
            color: ['#667eea', []],
        })
    }

    controls(control: string) {
        return this.form.get(control)
    }

    getValue() {
        return this.form.getRawValue()
    }

    patchForm(data: Partial<EventType>) {
        this.form.patchValue(data)
    }

    reset() {
        this.form.reset({
            name: '',
            slug: '',
            description: '',
            durationMinutes: 30,
            color: '#667eea',
        })
    }

    generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
    }

    isValid(): boolean {
        return this.form.valid
    }

    markAllAsTouched() {
        this.form.markAllAsTouched()
    }
}