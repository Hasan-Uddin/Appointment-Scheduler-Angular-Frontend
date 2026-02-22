import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ConfirmationService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { DialogService } from 'primeng/dynamicdialog'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { TableModule } from 'primeng/table'
import { Toolbar } from 'primeng/toolbar'
import { forkJoin } from 'rxjs'
import { AlertService } from '../../../common-service/lib/alert.service'
import { User } from '../../user.model'
import { UserListStateService } from '../../user-state.service'
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component'

@Component({
    selector: 'app-users-table',
    imports: [
        CommonModule,
        TableModule,
        IconFieldModule,
        ButtonModule,
        InputIconModule,
        InputTextModule,
        ConfirmDialogModule,
        Toolbar,
    ],
    templateUrl: './user-table.component.html',
    styleUrl: './user-table.component.css',
})
export class UserTableComponent {
    protected userListStateService = inject(UserListStateService)
    private confirmationService = inject(ConfirmationService)
    private dialogService = inject(DialogService)
    private alertService = inject(AlertService)

    editUser(todo: any) {
        this.userListStateService.updateUser(todo.id, todo)
    }

    openEditDialog(user: User) {
        const ref = this.dialogService.open(EditUserModalComponent, {
            header: 'Edit: ' + user.fullName,
            data: { user },
            width: '50%',
            closable: true,
            baseZIndex: 10000,
        })

        ref?.onClose.subscribe((user) => {
            this.userListStateService.replaceUser(user)
        })
    }

    confirmDeleteUser(user: User) {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: `Are you sure you want to delete ${user.fullName}?`,
            accept: () => {
                this.userListStateService.deleteUser(user.id).subscribe({
                    next: () => {
                        this.alertService.success(
                            `User ${user.fullName} deleted successfully`,
                        )
                    },
                    error: (err) => {
                        console.error('Delete user failed:', err)
                        this.alertService.error('Delete user failed')
                    },
                })
            },
        })
    }

    confirmDeleteSelectUsers(users: User[]) {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: `Are you sure, you want to delete ${users.length} users?`,
            accept: () => {
                const deleteRequests = users.map((user) =>
                    this.userListStateService.deleteUser(user.id),
                )
                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        // forkJoin waits for all to complete, so success should be here after all are deleted.
                    },
                    error: (err) => {
                        console.error('Delete user failed:', err)
                        this.alertService.error('Delete user failed')
                    },
                    complete: () => {
                        // Show success message after all deletions have completed
                        this.alertService.success(
                            `${users.length} users deleted successfully`,
                        )
                    },
                })
            },
        })
    }
}
