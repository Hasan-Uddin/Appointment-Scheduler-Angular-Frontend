import { Route } from '@angular/router'
import { PageLayout, setLayout } from '../../../libs/common-components'

export type NotFoundRoutes = {
    notFound: Route
}

export const notFoundRoutes: NotFoundRoutes = {
    notFound: {
        path: '**',
        loadComponent: () =>
            import('./page-not-found').then((m) => m.PageNotFoundComponent),
        resolve: { layout: setLayout(PageLayout.Blank) },
    },
}
