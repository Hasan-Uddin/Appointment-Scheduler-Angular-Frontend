import { CommonModule } from '@angular/common'
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
} from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { SelectModule } from 'primeng/select'
import { AlertService } from '../../../common-service/lib/alert.service'
import { TimeSettingsService } from '../../../common-service/lib/time-settings.service'
import { AvailabilityApiService } from '../../availability-api.service'
import { AvailabilityFormService } from '../../availability-form.service'
import { AvailabilityStateService } from '../../availability-state.service'

@Component({
    selector: 'app-create-availability-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, SelectModule],
    templateUrl: './create-availability-modal.component.html',
    providers: [AvailabilityFormService, AvailabilityStateService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAvailabilityModalComponent {
    protected formService = inject(AvailabilityFormService)
    private apiService = inject(AvailabilityApiService)
    private availabilityState = inject(AvailabilityStateService)
    private dialogRef = inject(DynamicDialogRef)
    private alertService = inject(AlertService)
    private config = inject(DynamicDialogConfig)
    private timeSettingsService = inject(TimeSettingsService)

    dayOfWeekControl = this.formService.form.get('dayOfWeek')
    loading = false
    dayOptions = this.formService.getDayOptions()

    // Compute time options dynamically based on 24-hour setting
    timeOptions = computed(() =>
        this.formService.getTimeOptions(
            this.timeSettingsService.use24HourFormat(),
        ),
    )

    constructor() {
        const userId = this.config.data?.userId
        if (userId) {
            this.availabilityState.setState({ userId })
        }
    }
    // ngOnInit() {
    //     // Pre-select current day
    //     const today = new Date().getDay()
    //     this.formService.controls('dayOfWeek')?.setValue(today)
    // }

    onSubmit() {
        if (!this.formService.isValid()) {
            this.formService.markAllAsTouched()
            return
        }

        this.loading = true

        const state = this.availabilityState.getState()
        const formValue = this.formService.getValue()

        // Convert to UTC before saving
        const utcStart = this.timeSettingsService.convertLocalToUtc(
            formValue.dayOfWeek,
            formValue.startTime,
        )
        const utcEnd = this.timeSettingsService.convertLocalToUtc(
            formValue.dayOfWeek,
            formValue.endTime,
        )

        const availabilityDto = {
            userId: state.userId,
            dayOfWeek: utcStart.dayOfWeek,
            startTime: utcStart.time,
            endTime: utcEnd.time,
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
