import { Route } from '@angular/router'
import { authGuard } from '../libs/guards/auth/auth.guard'
import { AuthRoutes, authRoutes } from './pages/auth/auth.route'
import {
    DashboardRoutes,
    dashboardRoutes,
} from './pages/dashboard/dashboard.route'
import {
    NotFoundRoutes,
    notFoundRoutes,
} from './pages/not-found/not-found.routes'
import { PublicRoutes, publicRoutes } from './pages/public/public.route'

type AppRouteGroups = [
    AuthRoutes,
    DashboardRoutes,
    PublicRoutes,
    NotFoundRoutes,
]

const groupedRoutes: AppRouteGroups = [
    authRoutes,
    dashboardRoutes,
    publicRoutes,
    notFoundRoutes,
]

const flattenedRoutes: Route[] = []

for (const routeGroup of groupedRoutes) {
    for (const route of Object.values(routeGroup)) {
        // Apply AuthGuard to dashboardRoutes, public user
        if (routeGroup === dashboardRoutes || routeGroup === publicRoutes) {
            route.canActivate = [...(route.canActivate ?? []), authGuard]
        }
        flattenedRoutes.push(route)
    }
}

export const appRoutes = flattenedRoutes
