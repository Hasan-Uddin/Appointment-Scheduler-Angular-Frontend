import { Injectable } from '@angular/core'
import { AbstractControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { Availability, DayOfWeek } from './availability.model'

@Injectable({
    providedIn: 'root',
})
export class AvailabilityFormService {
    form: FormGroup

    constructor(private fb: NonNullableFormBuilder) {
        this.form = this.buildForm()
    }

    buildForm(): FormGroup {
        const { required } = Validators
        return this.fb.group({
            dayOfWeek: [DayOfWeek.Monday, [required]],
            startTime: ['09:00', [required]],
            endTime: ['17:00', [required]],
        }, {
            validators: [this.timeRangeValidator]
        })
    }

    private timeRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const group = control as FormGroup;
        const start = group.get('startTime')?.value;
        const end = group.get('endTime')?.value;
        
        if (start && end && start >= end) {
            return { invalidTimeRange: true };
        }
        return null;
    }

    controls(control: string) {
        return this.form.get(control)
    }

    getValue() {
        return this.form.getRawValue()
    }

    patchForm(data: Partial<Availability>) {
        this.form.patchValue(data)
    }

    reset() {
        this.form.reset({
            dayOfWeek: DayOfWeek.Monday,
            startTime: '09:00',
            endTime: '17:00',
        })
    }

    isValid(): boolean {
        return this.form.valid
    }

    markAllAsTouched() {
        this.form.markAllAsTouched()
    }

    getDayOptions() {
        return [
            { label: 'Monday', value: DayOfWeek.Monday },
            { label: 'Tuesday', value: DayOfWeek.Tuesday },
            { label: 'Wednesday', value: DayOfWeek.Wednesday },
            { label: 'Thursday', value: DayOfWeek.Thursday },
            { label: 'Friday', value: DayOfWeek.Friday },
            { label: 'Saturday', value: DayOfWeek.Saturday },
            { label: 'Sunday', value: DayOfWeek.Sunday },
        ]
    }

    getTimeOptions() {
        const times: string[] = []
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                const hour = h.toString().padStart(2, '0')
                const minute = m.toString().padStart(2, '0')
                times.push(`${hour}:${minute}`)
            }
        }
        return times
    }
}