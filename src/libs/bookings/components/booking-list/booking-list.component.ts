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
import { TagModule } from 'primeng/tag'
import { Toolbar } from 'primeng/toolbar'
import { forkJoin } from 'rxjs'
import { AppTimePipe } from '../../../common-pipes/app-time.pipe'
import { AlertService } from '../../../common-service/lib/alert.service'
import { Booking } from '../../booking.model'
import { BookingListStateService } from '../../booking-state.service'
import { ViewBookingModalComponent } from '../view-booking-modal/view-booking-modal.component'

@Component({
    selector: 'app-booking-list',
    imports: [
        CommonModule,
        TableModule,
        IconFieldModule,
        ButtonModule,
        InputIconModule,
        InputTextModule,
        ConfirmDialogModule,
        TagModule,
        Toolbar,
        AppTimePipe,
    ],
    templateUrl: './booking-list.component.html',
    styleUrl: './booking-list.component.css',
})
export class BookingListComponent {
    protected bookingListStateService = inject(BookingListStateService)
    private confirmationService = inject(ConfirmationService)
    private dialogService = inject(DialogService)
    private alertService = inject(AlertService)

    getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
        const map: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
            confirmed: 'success',
            pending: 'warn',
            cancelled: 'danger',
            completed: 'info',
        }
        return map[status?.toLowerCase()] ?? 'warn'
    }

    openViewDialog(booking: Booking) {
        this.dialogService.open(ViewBookingModalComponent, {
            header: 'Booking: ' + booking.guestName,
            data: { booking },
            width: '480px',
            closable: true,
            baseZIndex: 10000,
            contentStyle: { padding: '0' },
        })
    }

    confirmDeleteBooking(booking: Booking) {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: `Are you sure you want to delete booking for ${booking.guestName}?`,
            accept: () => {
                this.bookingListStateService
                    .deleteBooking(booking.id)
                    .subscribe({
                        next: () => {
                            this.alertService.success(
                                `Booking for ${booking.guestName} deleted successfully`,
                            )
                        },
                        error: (err) => {
                            console.error('Delete booking failed:', err)
                            this.alertService.error('Delete booking failed')
                        },
                    })
            },
        })
    }

    confirmDeleteSelectedBookings(bookings: Booking[]) {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: `Are you sure you want to delete ${bookings.length} bookings?`,
            accept: () => {
                const deleteRequests = bookings.map((booking) =>
                    this.bookingListStateService.deleteBooking(booking.id),
                )
                forkJoin(deleteRequests).subscribe({
                    error: (err) => {
                        console.error('Delete bookings failed:', err)
                        this.alertService.error('Delete bookings failed')
                    },
                    complete: () => {
                        this.bookingListStateService.resetSelectedBookings()
                        this.alertService.success(
                            `${bookings.length} bookings deleted successfully`,
                        )
                    },
                })
            },
        })
    }
}
