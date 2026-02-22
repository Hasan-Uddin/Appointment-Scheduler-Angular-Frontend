import { CommonModule } from '@angular/common'
import { Component, HostListener, inject, OnInit } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TableModule } from 'primeng/table'
import { AuthService } from '../../../auth/service/auth.service'
import { SidebarService } from '../../../common-service/sidebar.service'
import { navItems } from './sidebar-items'

@Component({
    selector: 'app-sidebar-dashboard',
    standalone: true,
    imports: [RouterModule, CommonModule, TableModule],
    templateUrl: './sidebar-dashboard.component.html',
    styleUrl: './sidebar-dashboard.component.css',
})
export class SidebarDashboardComponent implements OnInit {
    navItems = navItems
    private authService = inject(AuthService)
    sidebarService = inject(SidebarService)
    isCentralizedOpen = false
    isMobileView = false
    centralizedLinks = ['country', 'region', 'district', 'area', 'localitie']

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.checkWindowWidth()
    }

    ngOnInit(): void {
        this.checkWindowWidth()
    }

    checkWindowWidth(): void {
        this.isMobileView = window.innerWidth < 768
        if (this.isMobileView) {
            this.sidebarService.isSidebarOpen.set(false)
        }
    }

    toggleCentralizedMenu() {
        this.isCentralizedOpen = !this.isCentralizedOpen
    }

    logOut() {
        this.authService.logout()
    }

    toggleSidebar() {
        this.sidebarService.toggleSidebar()
    }

    handleLinkClick(): void {
        if (this.isMobileView) {
            this.sidebarService.isSidebarOpen.set(false)
        }
    }
}
