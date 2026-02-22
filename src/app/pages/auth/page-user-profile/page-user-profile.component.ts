import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { InputTextModule } from 'primeng/inputtext'
import { ToastModule } from 'primeng/toast'

@Component({
    selector: 'app-profile',
    imports: [
        ReactiveFormsModule,
        CommonModule,
        ToastModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        RouterModule,
    ],
    providers: [MessageService],
    templateUrl: './page-user-profile.component.html',
})
export class UserProfileComponent {
    editVisible = false

    profileForm: FormGroup

    user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+880 1234567890',
        address: '123, Green Street, Dhaka, Bangladesh',
        gender: 'Male',
        dob: '2000-01-01',
    }

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
    ) {
        this.profileForm = this.fb.group({
            name: [this.user.name],
            email: [this.user.email],
            phone: [this.user.phone],
            address: [this.user.address],
            gender: [this.user.gender],
            dob: [this.user.dob],
        })
    }

    openEdit() {
        this.editVisible = true
    }

    saveProfile() {
        this.user = { ...this.profileForm.value }

        this.messageService.add({
            severity: 'success',
            summary: 'Profile Updated',
            detail: 'Your profile has been updated successfully!',
        })

        this.editVisible = false
    }
}
