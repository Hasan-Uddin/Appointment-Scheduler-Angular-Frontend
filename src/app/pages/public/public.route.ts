import { Route } from '@angular/router'
import {
    PageLayout,
    setLayout,
} from '../../../libs/common-components/layouts/layouts-helper'

export type PublicRoutes = {
    public_booking: Route
}

export const publicRoutes: PublicRoutes = {
    public_booking: {
        path: 'book/:username/:event-slug',
        loadComponent: () =>
            import('./page-public-booking/page-public-booking.component').then(
                (m) => m.PagePublicBookingComponent,
            ),
        resolve: { layout: setLayout(PageLayout.Public) },
    },
}
