import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MessageService, ConfirmationService } from 'primeng/api'
import { ToastModule } from 'primeng/toast'
import { EventTypeStateService } from '../../../../libs/event-type/event-type-state.service'
import { EventTypeListComponent } from '../../../../libs/event-type/components/event-type-list/event-type-list.component'

@Component({
    selector: 'app-page-event-types',
    standalone: true,
    imports: [CommonModule, ToastModule, EventTypeListComponent],
    templateUrl: './page-event-types.component.html',
    providers: [
        MessageService,
        ConfirmationService,
        EventTypeStateService,
    ],
})
export class PageEventTypesComponent implements OnInit {
    protected eventTypeState = inject(EventTypeStateService)

    ngOnInit(): void {
        this.eventTypeState.init()
    }
}