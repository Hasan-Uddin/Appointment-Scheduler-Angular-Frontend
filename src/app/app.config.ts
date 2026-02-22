import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common'
import {
    provideHttpClient,
    withInterceptors,
    withInterceptorsFromDi,
    withJsonpSupport,
    withXsrfConfiguration,
} from '@angular/common/http'
import {
    ApplicationConfig,
    provideAppInitializer,
    provideZonelessChangeDetection,
} from '@angular/core'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import {
    PreloadAllModules,
    provideRouter,
    withComponentInputBinding,
    withInMemoryScrolling,
    withPreloading,
    withRouterConfig,
} from '@angular/router'
import { provideStore } from '@ngrx/store'
import Aura from '@primeuix/themes/aura'
import { ConfirmationService, MessageService } from 'primeng/api'
import { providePrimeNG } from 'primeng/config'
import { DialogService } from 'primeng/dynamicdialog'
import { environment } from '../environments/environment'
import {
    ACCESS_TOKEN_KEY,
    AUTH_API_URL,
    AuthInterceptorFn,
    CONTEXT_USER_ID,
    CONTEXT_USER_ROLE,
    REFRESH_TOKEN_KEY,
} from '../libs/auth'
import { appInitializerFn, ENVIRONMENT } from '../libs/core'
import { appRoutes } from './app.routes'

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: ENVIRONMENT, useValue: environment },
        { provide: AUTH_API_URL, useValue: environment.authApiUrl },
        { provide: CONTEXT_USER_ID, useValue: 'contextUserId' },
        { provide: CONTEXT_USER_ROLE, useValue: 'contextUserRole' },
        { provide: ACCESS_TOKEN_KEY, useValue: 'accessToken' },
        { provide: REFRESH_TOKEN_KEY, useValue: 'refreshToken' },
        provideAppInitializer(appInitializerFn),
        provideZonelessChangeDetection(),
        provideRouter(
            appRoutes,
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
            withRouterConfig({ onSameUrlNavigation: 'reload' }),
            withComponentInputBinding(),
            withPreloading(PreloadAllModules),
        ),
        provideHttpClient(
            withXsrfConfiguration({}),
            withJsonpSupport(),
            withInterceptors([AuthInterceptorFn]),
            withInterceptorsFromDi(),
        ),
        {
            provide: DATE_PIPE_DEFAULT_OPTIONS,
            useValue: { timezone: 'UTC', dateFormat: 'shortDate' },
        },
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    prefix: 'p',
                    darkModeSelector: '.dark',
                    cssLayer: {
                        name: 'primeng',
                        order: 'theme, base, primeng, utilities',
                    },
                },
            },
        }),
        MessageService,
        ConfirmationService,
        DialogService,
        provideStore(),
    ],
}
