import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { InputNumberModule } from 'primeng/inputnumber'
import { ColorPickerModule } from 'primeng/colorpicker'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { EventTypeFormService } from '../../event-type-form.service'
import { EventTypeApiService } from '../../event-type-api.service'
import { AlertService } from '../../../common-service/lib/alert.service'
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-create-event-type-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputTextModule,
        TextareaModule,
        InputNumberModule,
        ColorPickerModule,
    ],
    templateUrl: './create-event-type-modal.component.html',
    providers: [EventTypeFormService],
})
export class CreateEventTypeModalComponent implements OnInit {
    protected formService = inject(EventTypeFormService)
    private apiService = inject(EventTypeApiService)
    private dialogRef = inject(DynamicDialogRef)
    private alertService = inject(AlertService)

    loading = false

    ngOnInit() {
        // Auto-generate slug from name
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

        this.apiService.createEventType(this.formService.getValue()).subscribe({
            next: () => {
                this.dialogRef.close(true)
            },
            error: (err) => {
                console.error('Create failed:', err)
                this.alertService.error('Failed to create event type')
                this.loading = false
            },
        })
    }

    cancel() {
        this.dialogRef.close(false)
    }
}