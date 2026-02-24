import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { ConfirmationService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'
import { AlertService } from '../../common-service/lib/alert.service'
import { AvailabilityFormService } from '../availability-form.service'
import { AvailabilityStateService } from '../availability-state.service'
import { Availability } from '../availability.model'
import { SelectModule } from 'primeng/select'

@Component({
    selector: 'app-edit-availability-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        SelectModule,
        ConfirmDialogModule,
    ],
    templateUrl: './edit-availability-modal.component.html',
    providers: [AvailabilityFormService, ConfirmationService],
})
export class EditAvailabilityModalComponent implements OnInit {
    protected formService = inject(AvailabilityFormService)
    private availabilityState = inject(AvailabilityStateService)
    private dialogRef = inject(DynamicDialogRef)
    private config = inject(DynamicDialogConfig)
    private alertService = inject(AlertService)
    private confirmationService = inject(ConfirmationService)

    loading = false
    deleting = false
    availability: Availability
    timeOptions = this.formService.getTimeOptions()

    constructor() {
        this.availability = this.config.data?.availability
    }

    ngOnInit() {
        if (this.availability) {
            this.formService.patchForm({
                dayOfWeek: this.availability.dayOfWeek,
                startTime: this.availability.startTime,
                endTime: this.availability.endTime,
            })
        }
    }

    onSubmit() {
        if (!this.formService.isValid()) {
            this.formService.markAllAsTouched()
            return
        }
        this.loading = true
        const formValue = this.formService.getValue()
        const updateData = {
            startTime: formValue.startTime,
            endTime: formValue.endTime,
        }

        this.availabilityState.updateAvailability(this.availability.id, updateData).subscribe({
            next: () => {
                this.alertService.success('Availability updated successfully')
                this.dialogRef.close(true)
            },
            error: (err) => {
                console.error('Update failed:', err)
                this.alertService.error('Failed to update availability')
                this.loading = false
            },
        })
    }

    onDelete() {
        this.confirmationService.confirm({
            header: 'Delete Availability',
            message: `Delete this time slot for ${this.getDayName(this.availability.dayOfWeek)}?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-outlined',
            defaultFocus: 'reject',
            accept: () => {
                this.performDelete()
            },
        })
    }

    onToggleActive() {
        this.availabilityState.toggleActive(this.availability.id).subscribe({
            next: () => {
                this.availability.isActive = !this.availability.isActive
                const action = this.availability.isActive ? 'activated' : 'deactivated'
                this.alertService.success(`Availability ${action}`)
            },
            error: (err) => {
                console.error('Toggle failed:', err)
                this.alertService.error('Operation failed')
            },
        })
    }

    private performDelete() {
        this.deleting = true

        this.availabilityState.deleteAvailability(this.availability.id).subscribe({
            next: () => {
                this.alertService.success('Availability deleted successfully')
                this.dialogRef.close({ action: 'deleted', id: this.availability.id })
            },
            error: (err) => {
                console.error('Delete failed:', err)
                this.alertService.error('Failed to delete availability')
                this.deleting = false
            },
        })
    }

    cancel() {
        if (this.formService.form.dirty) {
            this.confirmationService.confirm({
                header: 'Unsaved Changes',
                message: 'You have unsaved changes. Are you sure you want to close?',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Discard',
                rejectLabel: 'Keep Editing',
                acceptButtonStyleClass: 'p-button-danger',
                rejectButtonStyleClass: 'p-button-outlined',
                defaultFocus: 'reject',
                accept: () => {
                    this.dialogRef.close(false)
                },
            })
        } else {
            this.dialogRef.close(false)
        }
    }

    getDayName(day: number): string {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return days[day]
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