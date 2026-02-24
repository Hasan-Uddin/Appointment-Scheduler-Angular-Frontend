import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MessageService, ConfirmationService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { ContextUserStorageService } from '../../../../libs/auth/service/contextUser-storage.service'
import { AvailabilityListComponent } from '../../../../libs/availabilities/components/availability-list/availability-list.component'
import { AvailabilityStateService } from '../../../../libs/availabilities/availability-state.service'

@Component({
    selector: 'app-page-availability',
    standalone: true,
    imports: [CommonModule, ToastModule, AvailabilityListComponent],
    templateUrl: './page-availability.component.html',
    providers: [
        MessageService,
        ConfirmationService,
        AvailabilityStateService,
    ],
})
export class PageAvailabilityComponent implements OnInit {
    protected availabilityState = inject(AvailabilityStateService)
    private contextUserStorage = inject(ContextUserStorageService)

    ngOnInit(): void {
        const userId = this.contextUserStorage.getContextUserId()
        
        if (userId) {
            this.availabilityState.init(userId)
        }
    }
}