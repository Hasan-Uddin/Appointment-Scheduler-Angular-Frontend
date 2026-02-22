import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { ConfirmationService } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { AuthService } from '../../../../libs/auth/service/auth.service'
import { LocationStateService } from '../../../../libs/locations/location-state.service'
import { UserProfileCardComponent } from '../../../../libs/user-profile/components/user-card/user-card.component'
import { UserProfileStateService } from '../../../../libs/user-profile/user-profile-state.service'

@Component({
    selector: 'app-user-profile',
    imports: [CommonModule, UserProfileCardComponent, ButtonModule],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css',
    providers: [
        UserProfileStateService,
        ConfirmationService,
        LocationStateService,
    ],
})
export class UserProfileComponent implements OnInit {
    private locationState = inject(LocationStateService)
    private userProfileState = inject(UserProfileStateService)
    private authService = inject(AuthService)

    ngOnInit(): void {
        this.locationState.init()
        this.userProfileState.init()
    }

    logOut() {
        this.authService.logout()
    }
}
