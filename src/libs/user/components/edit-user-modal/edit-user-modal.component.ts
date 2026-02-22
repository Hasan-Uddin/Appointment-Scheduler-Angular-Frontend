import { Component, inject, signal } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { FloatLabelModule } from 'primeng/floatlabel'
import { InputTextModule } from 'primeng/inputtext'
import { FormInputComponent } from '../../../common-components/form/form-input/form-input.component'
import { AlertService } from '../../../common-service/lib/alert.service'
import { UserFormService } from '../../user.form.service'
import { User } from '../../user.model'
import { UserListStateService } from '../../user-state.service'

@Component({
    selector: 'app-edit-user-modal',
    imports: [
        ButtonModule,
        DialogModule,
        ReactiveFormsModule,
        FloatLabelModule,
        InputTextModule,
        FormInputComponent,
    ],
    providers: [UserListStateService],
    templateUrl: './edit-user-modal.component.html',
    styleUrl: './edit-user-modal.component.css',
})
export class EditUserModalComponent {
    public userFormService = inject(UserFormService)
    private userState = inject(UserListStateService)
    private alertService = inject(AlertService)
    private config = inject(DynamicDialogConfig)
    private dialogRef = inject(DynamicDialogRef)

    isLoading = signal<boolean>(false)
    isError = signal<boolean>(false)

    ngOnInit() {
        const selectedUser: User = this.config.data?.user
        if (selectedUser) {
            this.userFormService.patchForm(selectedUser)
        }
    }

    submit(event: Event) {
        this.isLoading.set(true)
        event.preventDefault()

        const selectedUser = this.config.data?.user
        const formValue = this.userFormService.getValue()

        // Merge existing user with form values
        const userData: User = {
            ...selectedUser, // keep all existing fields
            ...formValue, // overwrite with updated form fields
            id: selectedUser.id, // ensure id is preserved
        }

        this.updateUser(userData)
    }

    updateUser(user: User) {
        const ref = this.userState.updateUser(user.id, user).subscribe({
            next: (updatedUser) => {
                this.isLoading.set(false)
                this.isError.set(false)
                this.alertService.success('User updated successfully')
                this.dialogRef.close(user)
            },
            error: (err) => {
                this.isLoading.set(false)
                this.isError.set(true)
                //console.error('Update user failed:', err)
                this.alertService.error('Update user failed')
                this.dialogRef.close(user)
            },
        })
    }
}
