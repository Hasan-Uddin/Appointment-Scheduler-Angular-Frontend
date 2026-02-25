import { Component, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ConfirmationService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { DialogService } from 'primeng/dynamicdialog'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { SkeletonModule } from 'primeng/skeleton'
import { SelectButtonModule } from 'primeng/selectbutton'
import { forkJoin } from 'rxjs'
import { AlertService } from '../../../common-service/lib/alert.service'
import { EventType } from '../../event-type.model'
import { EventTypeStateService } from '../../event-type-state.service'
import { CreateEventTypeModalComponent } from '../create-event-type-modal/create-event-type-modal.component'
import { EditEventTypeModalComponent } from '../edit-event-type-modal/edit-event-type-modal.component'
import { EventTypeTileComponent } from '../event-type-tile/event-type-tile.component'
import { ContextUserStorageService } from '../../../auth/service/contextUser-storage.service'

interface FilterOption {
    label: string
    value?: boolean
}

@Component({
    selector: 'app-event-type-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        ConfirmDialogModule,
        SkeletonModule,
        SelectButtonModule,
        EventTypeTileComponent,
    ],
    templateUrl: './event-type-list.component.html',
    styleUrl: './event-type-list.component.css',
})
export class EventTypeListComponent {
    protected eventTypeState = inject(EventTypeStateService)
    private confirmationService = inject(ConfirmationService)
    private dialogService = inject(DialogService)
    private alertService = inject(AlertService)
    private userStorage = inject(ContextUserStorageService)
    private email = this.userStorage.getEmail()
    username = this.email?.split('@')[0] ?? null

    searchTerm = ''

    filterOptions: FilterOption[] = [
        { label: 'All', value: undefined },
        { label: 'Active', value: true },
        { label: 'Inactive', value: false },
    ]

    selectedFilter: FilterOption = this.filterOptions[0]

    onSearchChange(value: string) {
        this.eventTypeState.setSearch(value)
    }

    onFilterChange(filter: FilterOption) {
        this.eventTypeState.setActiveFilter(filter.value)
    }

    // Fixed: Accept selectedEventTypes from template
    isSelected(eventType: EventType, selectedEventTypes: EventType[]): boolean {
        return selectedEventTypes.some((et) => et.id === eventType.id)
    }

    onSelectionChange(eventType: EventType, checked: boolean) {
        const state = this.eventTypeState.getState()
        const current = state.selectedEventTypes || []

        if (checked) {
            this.eventTypeState.setSelectedEventTypes([...current, eventType])
        } else {
            this.eventTypeState.setSelectedEventTypes(
                current.filter((et) => et.id !== eventType.id),
            )
        }
    }

    openCreateDialog() {
        const ref = this.dialogService.open(CreateEventTypeModalComponent, {
            header: 'Create Event Type',
            width: '540px',
            closable: true,
            baseZIndex: 10000,
        })

        ref?.onClose.subscribe((created: boolean) => {
            if (created) {
                this.alertService.success('Event type created successfully')
            }
        })
    }

    openEditDialog(eventType: EventType) {
        const ref = this.dialogService.open(EditEventTypeModalComponent, {
            header: 'Edit Event Type',
            data: { eventType },
            width: '540px',
            closable: true,
            baseZIndex: 10000,
        })

        ref?.onClose.subscribe((updated: boolean) => {
            if (updated) {
                this.alertService.success('Event type updated successfully')
            }
        })
    }

    confirmDelete(eventType: EventType) {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: `Are you sure you want to delete "${eventType.name}"?`,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.eventTypeState.deleteEventType(eventType.id).subscribe({
                    next: () => {
                        this.alertService.success(
                            `"${eventType.name}" deleted successfully`,
                        )
                    },
                    error: (err) => {
                        console.error('Delete failed:', err)
                        this.alertService.error('Delete failed')
                    },
                })
            },
        })
    }

    confirmDeleteSelected(eventTypes: EventType[]) {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: `Are you sure you want to delete ${eventTypes.length} event types?`,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                const deleteRequests = eventTypes.map((et) =>
                    this.eventTypeState.deleteEventType(et.id),
                )
                forkJoin(deleteRequests).subscribe({
                    error: (err) => {
                        console.error('Delete failed:', err)
                        this.alertService.error('Delete failed')
                    },
                    complete: () => {
                        this.eventTypeState.resetSelectedEventTypes()
                        this.alertService.success(
                            `${eventTypes.length} event types deleted`,
                        )
                    },
                })
            },
        })
    }

    toggleActive(eventType: EventType) {
        this.eventTypeState.toggleActive(eventType.id).subscribe({
            next: () => {
                const action = eventType.isActive ? 'deactivated' : 'activated'
                this.alertService.success(`"${eventType.name}" ${action}`)
            },
            error: (err) => {
                console.error('Toggle failed:', err)
                this.alertService.error('Operation failed')
            },
        })
    }

    duplicateEventType(eventType: EventType) {
        this.eventTypeState.duplicateEventType(eventType.id).subscribe({
            next: () => {
                this.alertService.success(
                    `"${eventType.name}" duplicated successfully`,
                )
            },
            error: (err) => {
                console.error('Duplicate failed:', err)
                this.alertService.error('Duplicate failed')
            },
        })
    }

    copyBookingLink(eventType: EventType) {
        const link = `${window.location.origin}/book/${ this.username }/${eventType.slug}`
        navigator.clipboard.writeText(link).then(() => {
            this.alertService.success('Booking link copied to clipboard')
        })
    }

    get activeCount(): number {
        const state = this.eventTypeState.getState()
        const eventTypes = state.eventTypes ?? []
        return eventTypes.filter((et) => et.isActive).length
    }

    get inactiveCount(): number {
        const state = this.eventTypeState.getState()
        const eventTypes = state.eventTypes ?? []
        return eventTypes.filter((et) => !et.isActive).length
    }
}
