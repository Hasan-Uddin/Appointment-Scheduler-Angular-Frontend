import { Route } from '@angular/router'
import {
    PageLayout,
    setLayout,
} from '../../../libs/common-components/layouts/layouts-helper'

export type PublicRoutes = {
    user_profile: Route
}

export const publicRoutes: PublicRoutes = {
    user_profile: {
        path: 'user-profile',
        loadComponent: () =>
            import('./user-profile/user-profile.component').then(
                (m) => m.UserProfileComponent,
            ),
        resolve: { layout: setLayout(PageLayout.Public) },
    },
}
