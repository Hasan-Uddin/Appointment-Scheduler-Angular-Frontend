import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { PaginatorModule } from 'primeng/paginator'
import { TableModule } from 'primeng/table'
import { ToastModule } from 'primeng/toast'
import { BookingListStateService } from '../../../../libs/bookings'
import { BookingListComponent } from '../../../../libs/bookings/components/booking-list/booking-list.component'

@Component({
    selector: 'app-page-bookings',
    standalone: true,
    imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    BookingListComponent
],
    templateUrl: './page-bookings.component.html',
    styleUrls: ['./page-bookings.component.css'],
    providers: [MessageService, ConfirmationService, BookingListStateService],
})
export class PageBookingsComponent implements OnInit {
    protected bookingState = inject(BookingListStateService)

    ngOnInit(): void {
        this.bookingState.init()
    }
}
