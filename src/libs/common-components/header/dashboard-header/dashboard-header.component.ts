import { Component, inject } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AuthService } from '../../../auth/service/auth.service'
import { SidebarService } from '../../../common-service/sidebar.service'

@Component({
    selector: 'app-dashboard-header',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './dashboard-header.component.html',
    styleUrl: './dashboard-header.component.css',
})
export class DashboardHeaderComponent {
    private authService = inject(AuthService)
    private sidebarService = inject(SidebarService)

    logOut() {
        this.authService.logout()
    }

    toggleSidebar() {
        this.sidebarService.toggleSidebar()
    }
}
