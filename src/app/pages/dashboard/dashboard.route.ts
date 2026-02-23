import { Route } from '@angular/router'
import { PageLayout, setLayout } from '../../../libs/common-components'

export type DashboardRoutes = {
    bookings: Route
    eventType: Route
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
    eventType: {
        path: 'host/event-types',
        loadComponent: () =>
            import('./page-event-types/page-event-types.component').then(
                (m) => m.PageEventTypesComponent,
            ),
        resolve: { layout: setLayout(PageLayout.Dashboard) },
    },
}
