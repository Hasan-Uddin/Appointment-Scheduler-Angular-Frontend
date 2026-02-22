import { AsyncPipe, CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterOutlet } from '@angular/router'
import { NgxSonnerToaster } from 'ngx-sonner'
import { ConfirmDialog } from 'primeng/confirmdialog'
import { ConfirmPopup } from 'primeng/confirmpopup'
import { ToastModule } from 'primeng/toast'
import {
    LayoutDashboardComponent,
    LayoutPublicComponent,
    PageLayout,
    PageLayoutService,
} from '../libs/common-components'
import { LoginModalComponent } from '../libs/auth/Components/login-modal/login-modal.component'
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterOutlet,
        AsyncPipe,
        LayoutPublicComponent,
        LayoutDashboardComponent,
        ConfirmDialog,
        NgxSonnerToaster,
        ConfirmPopup,
        ToastModule,
    ],
    templateUrl: './app.component.html',
})
export class AppComponent {
    readonly PageLayout = PageLayout
    protected layoutService = inject(PageLayoutService)
}
