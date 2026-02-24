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
            import('..//page-todo/page-todo.component').then(
                (m) => m.PageTodoComponent,
            ),
        resolve: { layout: setLayout(PageLayout.Public) },
    },
}
