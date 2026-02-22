import { Route } from '@angular/router'
import { PageLayout, setLayout } from '../../../libs/common-components'

export type AuthRoutes = {
    default: Route
    todo: Route
    profile: Route
}

export const authRoutes: AuthRoutes = {
    default: {
        path: '',
        redirectTo: 'host/bookings',
        pathMatch: 'full',
    },
    todo: {
        path: 'todo',
        loadComponent: () =>
            import('../page-todo/page-todo.component').then(
                (m) => m.PageTodoComponent,
            ),
        resolve: { layout: setLayout(PageLayout.Public) },
    },
    profile: {
        path: 'profile',
        pathMatch: 'full',
        loadComponent: () =>
            import('./page-user-profile/page-user-profile.component').then(
                (m) => m.UserProfileComponent,
            ),
        resolve: { layout: setLayout(PageLayout.Public) },
    },
}
