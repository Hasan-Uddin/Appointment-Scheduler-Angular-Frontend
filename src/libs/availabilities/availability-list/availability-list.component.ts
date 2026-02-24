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
import { CheckboxModule } from 'primeng/checkbox'
import { forkJoin } from 'rxjs'
import { AlertService } from '../../common-service/lib/alert.service'
import { AvailabilityStateService } from '../availability-state.service'
import { Availability } from '../availability.model'
import { CreateAvailabilityModalComponent } from '../create-availability-modal/create-availability-modal.component'
import { EditAvailabilityModalComponent } from '../edit-availability-modal/edit-availability-modal.component'
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag'

interface DayFilter {
    label: string
    value?: number
}

@Component({
    selector: 'app-availability-list',
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
        CheckboxModule,
        TagModule,
        TooltipModule,
    ],
    templateUrl: './availability-list.component.html',
    styleUrl: './availability-list.component.css',
})
export class AvailabilityListComponent {
    protected availabilityState = inject(AvailabilityStateService)
    private confirmationService = inject(ConfirmationService)
    private dialogService = inject(DialogService)
    private alertService = inject(AlertService)

    searchTerm = ''
    
    dayFilters: DayFilter[] = [
        { label: 'All Days', value: undefined },
        { label: 'Mon', value: 1 },
        { label: 'Tue', value: 2 },
        { label: 'Wed', value: 3 },
        { label: 'Thu', value: 4 },
        { label: 'Fri', value: 5 },
        { label: 'Sat', value: 6 },
        { label: 'Sun', value: 0 },
    ]
    
    selectedDayFilter: DayFilter = this.dayFilters[0]

    getActiveCount(availabilities: Availability[]): number {
        return availabilities.filter(a => a.isActive).length;
    }
    
    // Search & Filter
    onSearchChange(value: string) {
        this.availabilityState.setSearch(value)
    }

    onDayFilterChange(filter: DayFilter) {
        this.availabilityState.setDayFilter(filter.value)
    }

    // Selection Management
    
    isSelected(availability: Availability, selectedAvailabilities: Availability[]): boolean {
        return selectedAvailabilities.some((a) => a.id === availability.id)
    }

    onSelectionChange(availability: Availability, checked: boolean) {
        const state = this.availabilityState.getState()
        const current = state.selectedAvailabilities || []
        
        if (checked) {
            this.availabilityState.setSelectedAvailabilities([...current, availability])
        } else {
            this.availabilityState.setSelectedAvailabilities(
                current.filter((a) => a.id !== availability.id),
            )
        }
    }
    
    openCreateDialog() {
        const ref = this.dialogService.open(CreateAvailabilityModalComponent, {
            header: 'Add Availability',
            width: '480px',
            closable: true,
            baseZIndex: 10000,
        })

        ref?.onClose.subscribe((created: boolean) => {
            if (created) {
                this.alertService.success('Availability added successfully')
            }
        })
    }

    openEditDialog(availability: Availability) {
        const ref = this.dialogService.open(EditAvailabilityModalComponent, {
            header: 'Edit Availability',
            data: { availability },
            width: '480px',
            closable: true,
            baseZIndex: 10000,
        })

        ref?.onClose.subscribe((result: any) => {
            if (result === true) {
                this.alertService.success('Availability updated successfully')
            } else if (result?.action === 'deleted') {
                // Already handled by state
            }
        })
    }

    // Delete Operations

    confirmDelete(availability: Availability) {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: `Delete availability for ${this.getDayName(availability.dayOfWeek)} ${availability.startTime}-${availability.endTime}?`,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.availabilityState.deleteAvailability(availability.id).subscribe({
                    next: () => {
                        this.alertService.success('Availability deleted successfully')
                    },
                    error: (err) => {
                        console.error('Delete failed:', err)
                        this.alertService.error('Delete failed')
                    },
                })
            },
        })
    }

    confirmDeleteSelected(availabilities: Availability[]) {
        this.confirmationService.confirm({
            header: 'Delete Confirmation',
            message: `Are you sure you want to delete ${availabilities.length} availability slots?`,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                const deleteRequests = availabilities.map((a) =>
                    this.availabilityState.deleteAvailability(a.id),
                )
                forkJoin(deleteRequests).subscribe({
                    error: (err) => {
                        console.error('Delete failed:', err)
                        this.alertService.error('Delete failed')
                    },
                    complete: () => {
                        this.availabilityState.resetSelectedAvailabilities()
                        this.alertService.success(`${availabilities.length} slots deleted`)
                    },
                })
            },
        })
    }

    confirmClearDay(dayOfWeek: number) {
        const dayName = this.getDayName(dayOfWeek)
        this.confirmationService.confirm({
            header: 'Clear Day',
            message: `Remove all availability slots for ${dayName}?`,
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.availabilityState.clearDay(dayOfWeek).subscribe({
                    next: () => {
                        this.alertService.success(`${dayName} cleared successfully`)
                    },
                    error: (err) => {
                        console.error('Clear day failed:', err)
                        this.alertService.error('Operation failed')
                    },
                })
            },
        })
    }

    // Toggle Active
    
    toggleActive(availability: Availability) {
        this.availabilityState.toggleActive(availability.id).subscribe({
            next: () => {
                const action = availability.isActive ? 'deactivated' : 'activated'
                this.alertService.success(`Availability ${action}`)
            },
            error: (err) => {
                console.error('Toggle failed:', err)
                this.alertService.error('Operation failed')
            },
        })
    }

    // Helper Methods
    
    getDayName(day: number): string {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return days[day] || 'Unknown'
    }

    getGroupedAvailabilities() {
        return this.availabilityState.getGroupedAvailabilities()
    }

    getActiveDaysCount(availabilities: Availability[]): number {
        const uniqueDays = new Set(
            availabilities
                .filter(a => a.isActive)
                .map(a => a.dayOfWeek)
        )
        return uniqueDays.size
    }

    formatTime(time: string): string {
        if (!time) return ''
        
        const [hour, minute] = time.split(':').map(Number)
        const period = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`
    }

    getDuration(availability: Availability): string {
        if (!availability.startTime || !availability.endTime) return ''
        
        const [startHour, startMin] = availability.startTime.split(':').map(Number)
        const [endHour, endMin] = availability.endTime.split(':').map(Number)
        
        const startMinutes = startHour * 60 + startMin
        const endMinutes = endHour * 60 + endMin
        const duration = endMinutes - startMinutes
        
        if (duration <= 0) return '0 min'
        
        const hours = Math.floor(duration / 60)
        const mins = duration % 60
        
        if (hours === 0) return `${mins} min`
        if (mins === 0) return `${hours} hr`
        return `${hours} hr ${mins} min`
    }

    // Statistics Helpers
    
    getTotalActiveSlots(availabilities: Availability[]): number {
        return availabilities.filter(a => a.isActive).length
    }

    getTotalHoursPerWeek(availabilities: Availability[]): number {
        let totalMinutes = 0
        
        availabilities
            .filter(a => a.isActive)
            .forEach(a => {
                const [startHour, startMin] = a.startTime.split(':').map(Number)
                const [endHour, endMin] = a.endTime.split(':').map(Number)
                
                const startMinutes = startHour * 60 + startMin
                const endMinutes = endHour * 60 + endMin
                totalMinutes += (endMinutes - startMinutes)
            })
        
        return Math.round((totalMinutes / 60) * 10) / 10 // Round to 1 decimal
    }

    // Batch Operations
    
    selectAll(availabilities: Availability[]) {
        this.availabilityState.setSelectedAvailabilities([...availabilities])
    }

    deselectAll() {
        this.availabilityState.resetSelectedAvailabilities()
    }

    activateSelected(availabilities: Availability[]) {
        const inactiveSlots = availabilities.filter(a => !a.isActive)
        
        if (inactiveSlots.length === 0) {
            this.alertService.info('All selected slots are already active')
            return
        }

        const requests = inactiveSlots.map(a => 
            this.availabilityState.toggleActive(a.id)
        )

        forkJoin(requests).subscribe({
            complete: () => {
                this.availabilityState.resetSelectedAvailabilities()
                this.alertService.success(`${inactiveSlots.length} slots activated`)
            },
            error: (err) => {
                console.error('Activation failed:', err)
                this.alertService.error('Failed to activate slots')
            },
        })
    }

    deactivateSelected(availabilities: Availability[]) {
        const activeSlots = availabilities.filter(a => a.isActive)
        
        if (activeSlots.length === 0) {
            this.alertService.info('All selected slots are already inactive')
            return
        }

        const requests = activeSlots.map(a => 
            this.availabilityState.toggleActive(a.id)
        )

        forkJoin(requests).subscribe({
            complete: () => {
                this.availabilityState.resetSelectedAvailabilities()
                this.alertService.success(`${activeSlots.length} slots deactivated`)
            },
            error: (err) => {
                console.error('Deactivation failed:', err)
                this.alertService.error('Failed to deactivate slots')
            },
        })
    }
}