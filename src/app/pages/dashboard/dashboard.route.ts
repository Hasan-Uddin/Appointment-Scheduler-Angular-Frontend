import { Route } from '@angular/router'
import { PageLayout, setLayout } from '../../../libs/common-components'

export type DashboardRoutes = {
    bookings: Route
}

export const dashboardRoutes: DashboardRoutes = {
    bookings: {
        path: 'host/bookings',
        loadComponent: () =>
            import('./page-booking/page-bookings.component').then(
                (m) => m.PageBookingsComponent,
            ),
        resolve: { layout: setLayout(PageLayout.Dashboard) },
    },
}
