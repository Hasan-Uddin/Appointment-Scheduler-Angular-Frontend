import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { SelectModule } from 'primeng/select'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { AlertService } from '../../common-service/lib/alert.service'
import { AvailabilityApiService } from '../availability-api.service'
import { AvailabilityFormService } from '../availability-form.service'
import { AvailabilityStateService } from '../availability-state.service'

@Component({
    selector: 'app-create-availability-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        SelectModule,
    ],
    templateUrl: './create-availability-modal.component.html',
    providers: [AvailabilityStateService],
})
export class CreateAvailabilityModalComponent implements OnInit {
    protected formService = inject(AvailabilityFormService)
    private apiService = inject(AvailabilityApiService)
    private availabilityState = inject(AvailabilityStateService)
    private dialogRef = inject(DynamicDialogRef)
    private alertService = inject(AlertService)

    loading = false
    dayOptions = this.formService.getDayOptions()
    timeOptions = this.formService.getTimeOptions()

    ngOnInit() {
        // Pre-select current day
        const today = new Date().getDay()
        this.formService.controls('dayOfWeek')?.setValue(today)
    }

    onSubmit() {
        if (!this.formService.isValid()) {
            this.formService.markAllAsTouched()
            return
        }

        this.loading = true

        const state = this.availabilityState.getState()
        const formValue = this.formService.getValue()
        
        const availabilityDto = {
            userId: state.userId,
            dayOfWeek: formValue.dayOfWeek,
            startTime: formValue.startTime,
            endTime: formValue.endTime,
        }

        this.apiService.createAvailability(availabilityDto).subscribe({
            next: (created) => {
                this.availabilityState.pushAvailability(created)
                this.dialogRef.close(true)
            },
            error: (err) => {
                console.error('Create failed:', err)
                this.alertService.error('Failed to create availability')
                this.loading = false
            },
        })
    }

    cancel() {
        this.dialogRef.close(false)
    }

    onDayChange() {
        // You can add logic here to suggest common times based on day
    }

    // Quick time presets
    setWorkingHours() {
        this.formService.controls('startTime')?.setValue('09:00')
        this.formService.controls('endTime')?.setValue('17:00')
    }

    setMorning() {
        this.formService.controls('startTime')?.setValue('09:00')
        this.formService.controls('endTime')?.setValue('12:00')
    }

    setAfternoon() {
        this.formService.controls('startTime')?.setValue('13:00')
        this.formService.controls('endTime')?.setValue('17:00')
    }

    setEvening() {
        this.formService.controls('startTime')?.setValue('17:00')
        this.formService.controls('endTime')?.setValue('21:00')
    }
}