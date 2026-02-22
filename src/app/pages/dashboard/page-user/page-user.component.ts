import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ConfirmationService, MessageService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { PaginatorModule } from 'primeng/paginator'
import { TableModule } from 'primeng/table'
import { ToastModule } from 'primeng/toast'
import { UserTableComponent } from '../../../../libs/user/components/user-table/user-table.component'
import { UserListStateService } from '../../../../libs/user/user-state.service'

@Component({
    selector: 'app-page-user',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        PaginatorModule,
        ButtonModule,
        ToastModule,
        DialogModule,
        InputTextModule,
        FormsModule,
        IconFieldModule,
        InputIconModule,
        UserTableComponent,
    ],
    templateUrl: './page-user.component.html',
    styleUrls: ['./page-user.component.css'],
    providers: [MessageService, ConfirmationService, UserListStateService],
})
export class PageUserComponent implements OnInit {
    protected userState = inject(UserListStateService)

    ngOnInit(): void {
        this.userState.init()
    }
}
