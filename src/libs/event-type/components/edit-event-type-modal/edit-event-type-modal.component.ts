import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { InputNumberModule } from 'primeng/inputnumber'
import { ColorPickerModule } from 'primeng/colorpicker'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'
import { ConfirmationService } from 'primeng/api'
import { EventTypeFormService } from '../../event-type-form.service'
import { EventTypeStateService } from '../../event-type-state.service'
import { AlertService } from '../../../common-service/lib/alert.service'
import { EventType } from '../../event-type.model'

@Component({
    selector: 'app-edit-event-type-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        ColorPickerModule,
        ConfirmDialogModule,
    ],
    templateUrl: './edit-event-type-modal.component.html',
    providers: [ConfirmationService], // Add ConfirmationService provider
})
export class EditEventTypeModalComponent implements OnInit {
    protected formService = inject(EventTypeFormService)
    private eventTypeState = inject(EventTypeStateService)
    private dialogRef = inject(DynamicDialogRef)
    private config = inject(DynamicDialogConfig)
    private alertService = inject(AlertService)
    private confirmationService = inject(ConfirmationService)

    loading = false
    deleting = false
    eventType: EventType

    constructor() {
        this.eventType = this.config.data?.eventType
    }

    ngOnInit() {
        // Patch form with existing data
        if (this.eventType) {
            this.formService.patchForm({
                name: this.eventType.name,
                slug: this.eventType.slug,
                description: this.eventType.description,
                durationMinutes: this.eventType.durationMinutes,
                color: this.eventType.color,
            })
            
            // Mark slug as dirty to prevent auto-generation
            this.formService.controls('slug')?.markAsDirty()
        }

        // Auto-generate slug from name (only if not dirty)
        this.formService.controls('name')?.valueChanges.subscribe((name) => {
            const slugControl = this.formService.controls('slug')
            if (name && !slugControl?.dirty) {
                const slug = this.formService.generateSlug(name)
                slugControl?.setValue(slug, { emitEvent: false })
            }
        })
    }

    onSubmit() {
        if (!this.formService.isValid()) {
            this.formService.markAllAsTouched()
            return
        }

        this.loading = true

        const formValue = this.formService.getValue()
        
        // Only send changed fields (excluding slug as it shouldn't change)
        const updateData = {
            name: formValue.name,
            description: formValue.description,
            durationMinutes: formValue.durationMinutes,
            color: formValue.color,
        }

        this.eventTypeState.updateEventType(this.eventType.id, updateData).subscribe({
            next: () => {
                this.alertService.success('Event type updated successfully')
                this.dialogRef.close(true)
            },
            error: (err) => {
                console.error('Update failed:', err)
                this.alertService.error('Failed to update event type')
                this.loading = false
            },
        })
    }

    onDelete() {
        this.confirmationService.confirm({
            header: 'Delete Event Type',
            message: `Are you sure you want to delete "${this.eventType.name}"? This action cannot be undone.`,
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

    private performDelete() {
        this.deleting = true

        this.eventTypeState.deleteEventType(this.eventType.id).subscribe({
            next: () => {
                this.alertService.success(`"${this.eventType.name}" deleted successfully`)
                this.dialogRef.close({ action: 'deleted', id: this.eventType.id })
            },
            error: (err) => {
                console.error('Delete failed:', err)
                this.alertService.error('Failed to delete event type')
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
}