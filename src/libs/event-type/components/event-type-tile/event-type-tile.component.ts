import { Component, input, output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { TagModule } from 'primeng/tag'
import { CheckboxModule } from 'primeng/checkbox'
import { MenuModule } from 'primeng/menu'
import { MenuItem } from 'primeng/api'
import { EventType } from '../../event-type.model'
import { FormsModule } from '@angular/forms'

@Component({
    selector: 'app-event-type-tile',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TagModule,
        CheckboxModule,
        FormsModule,
        MenuModule,
    ],
    templateUrl: './event-type-tile.component.html',
    styleUrl: './event-type-tile.component.css',
})
export class EventTypeTileComponent {
    eventType = input.required<EventType>()
    selected = input<boolean>(false)

    selectionChange = output<boolean>()
    edit = output<EventType>()
    delete = output<EventType>()
    toggleActive = output<EventType>()
    copyLink = output<EventType>()
    duplicate = output<EventType>()

    menuItems: MenuItem[] = []

    ngOnInit() {
        this.menuItems = [
            {
                label: 'Edit',
                icon: 'pi pi-pencil',
                command: () => this.edit.emit(this.eventType()),
            },
            {
                label: 'Duplicate',
                icon: 'pi pi-copy',
                command: () => this.duplicate.emit(this.eventType()),
            },
            {
                label: this.eventType().isActive ? 'Deactivate' : 'Activate',
                icon: this.eventType().isActive ? 'pi pi-eye-slash' : 'pi pi-eye',
                command: () => this.toggleActive.emit(this.eventType()),
            },
            {
                label: 'Copy Link',
                icon: 'pi pi-link',
                command: () => this.copyLink.emit(this.eventType()),
            },
            { separator: true },
            {
                label: 'Delete',
                icon: 'pi pi-trash',
                styleClass: 'text-red-500',
                command: () => this.delete.emit(this.eventType()),
            },
        ]
    }

    onSelectionChange(checked: boolean) {
        this.selectionChange.emit(checked)
    }

    getDurationDisplay(minutes: number): string {
        if (minutes < 60) return `${minutes} min`
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        if (mins === 0) return `${hours} hr`
        return `${hours} hr ${mins} min`
    }

    getBookingUrl(): string {
        return `${window.location.origin}/book/${this.eventType().slug}`
    }
}