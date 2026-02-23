import { Component, inject } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import { AvatarModule } from 'primeng/avatar'
import { DividerModule } from 'primeng/divider'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Booking } from '../../booking.model'

@Component({
    selector: 'app-view-booking-modal',
    imports: [
        CommonModule,
        ButtonModule,
        TagModule,
        AvatarModule,
        DividerModule
    ],
    templateUrl: './view-booking-modal.component.html',
})
export class ViewBookingModalComponent {
    private config = inject(DynamicDialogConfig)
    private dialogRef = inject(DynamicDialogRef)

    booking: Booking = this.config.data?.booking

    getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
        const map: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
            confirmed: 'success',
            pending: 'warn',
            cancelled: 'danger',
            completed: 'info',
        }
        return map[status?.toLowerCase()] ?? 'warn'
    }
    
    getDuration(start?: string, end?: string): string {
        if (!start || !end) return '—'
        const diffMs = new Date(end).getTime() - new Date(start).getTime()
        const diffMins = Math.round(diffMs / 60000)
        const hours = Math.floor(diffMins / 60)
        const mins = diffMins % 60
        if (hours === 0) return `${mins} min`
        if (mins === 0) return `${hours} hr`
        return `${hours} hr ${mins} min`
    }

    close() {
        this.dialogRef.close()
    }
}