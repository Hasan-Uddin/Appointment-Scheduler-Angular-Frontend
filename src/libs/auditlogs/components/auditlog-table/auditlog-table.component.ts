import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { ConfirmationService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { DialogModule } from 'primeng/dialog'
import { DialogService } from 'primeng/dynamicdialog'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { TableModule } from 'primeng/table'
import { Toolbar } from 'primeng/toolbar'
import { forkJoin } from 'rxjs'
import { AlertService } from '../../../common-service/lib/alert.service'
import { AuditLogListStateService } from '../..'
import { AuditLog } from '../../auditlog.model'

@Component({
    selector: 'app-auditlog-table',
    imports: [
        CommonModule,
        TableModule,
        IconFieldModule,
        ButtonModule,
        DialogModule,
        InputIconModule,
        InputTextModule,
        ConfirmDialogModule,
        Toolbar,
    ],
    templateUrl: './auditlog-table.component.html',
    styleUrl: './auditlog-table.component.css',
})
export class AuditLogTableComponent {
    protected auditListStateService = inject(AuditLogListStateService)
    private confirmationService = inject(ConfirmationService)
    private alertService = inject(AlertService)

    confirmDeleteAuditLog(auditLog: AuditLog) {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: `Are you sure you want to delete ${auditLog.id}?`,
            accept: () => {
                this.auditListStateService
                    .deleteAuditLog(auditLog.id)
                    .subscribe({
                        next: () => {
                            this.alertService.success(
                                `AuditLog ${auditLog.id} deleted successfully`,
                            )
                        },
                        error: (err) => {
                            console.error('Delete auditLog failed:', err)
                            this.alertService.error('Delete auditLog failed')
                        },
                    })
            },
        })
    }

    confirmDeleteSelectedAuditLog(auditLogs: AuditLog[]) {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: `Are you sure, you want to delete ${auditLogs.length} auditLogs?`,
            accept: () => {
                const deleteRequests = auditLogs.map((auditLog) =>
                    this.auditListStateService.deleteAuditLog(auditLog.id),
                )
                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        // forkJoin waits for all to complete, so success should be here after all are deleted.
                    },
                    error: (err) => {
                        console.error('Delete auditLog failed:', err)
                        this.alertService.error('Delete auditLog failed')
                    },
                    complete: () => {
                        // Show success message after all deletions have completed
                        this.alertService.success(
                            `${auditLogs.length} auditLogs deleted successfully`,
                        )
                        this.auditListStateService.resetSelectedAuditLogs()
                    },
                })
            },
        })
    }
}
