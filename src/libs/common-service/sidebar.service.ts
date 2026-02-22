import { Injectable, signal } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class SidebarService {
    isSidebarOpen = signal(true)

    toggleSidebar(): void {
        this.isSidebarOpen.update((value) => !value)
    }
}
