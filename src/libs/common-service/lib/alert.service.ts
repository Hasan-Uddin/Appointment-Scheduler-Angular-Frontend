import { Injectable, inject } from '@angular/core'
import { toast } from 'ngx-sonner'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ConfirmDialogData } from '../model/confirm-dialog.model'

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    private confirmationService = inject(ConfirmationService)
    private messageService = inject(MessageService)

    private getToastKey(): string {
        return 'myToast'
    }

    success(message: string) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 1500,
            key: this.getToastKey(),
        })
    }

    error(message: string) {
        this.messageService.add({
            detail: message,
            severity: 'error',
            summary: 'Error',
            life: 1500,
            key: this.getToastKey(),
        })
    }

    info(message: string) {
        this.messageService.add({
            detail: message,
            severity: 'info',
            summary: 'Info',
            life: 1500,
            key: this.getToastKey(),
        })
    }

    warn(message: string) {
        this.messageService.add({
            detail: message,
            severity: 'warning',
            summary: 'Warning',
            life: 1500,
            key: this.getToastKey(),
        })
    }

    loading(message: string) {
        toast.loading(message)
    }

    confirm(data: ConfirmDialogData): void {
        this.confirmationService.confirm({
            key: 'confirmDialog',
            target: data?.event?.target as EventTarget,
            message: data.message ?? 'Are you sure?',
            header: data.title ?? 'Confirmation',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: data.cancelButtonLabel ?? 'Cancel',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: data.confirmButtonLabel ?? 'Yes',
                styleClass: 'bg-green-400',
            },
            accept: data.confirmAction,
        })
    }
}
