import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { SidebarService } from '../../../common-service/sidebar.service'
import { DashboardHeaderComponent } from '../../header/dashboard-header/dashboard-header.component'
import { SidebarDashboardComponent } from '../../sidebar/sidebar-dashboard/sidebar-dashboard.component'

@Component({
    selector: 'app-layout-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        DashboardHeaderComponent,
        SidebarDashboardComponent,
    ],
    templateUrl: './layout-dashboard.component.html',
    styleUrl: './layout-dashboard.component.css',
})
export class LayoutDashboardComponent {
    sidebarService = inject(SidebarService)
}
