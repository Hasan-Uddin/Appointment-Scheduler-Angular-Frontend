import { Route } from '@angular/router'
import { PageLayout, setLayout } from '../../../libs/common-components'

export type DashboardRoutes = {
    user: Route
}

export const dashboardRoutes: DashboardRoutes = {
    user: {
        path: 'host/bookings',
        loadComponent: () =>
            import('./page-user/page-user.component').then(
                (m) => m.PageUserComponent,
            ),
        resolve: { layout: setLayout(PageLayout.Dashboard) },
    },
}
