import { InjectionToken } from '@angular/core'

export const AUTH_API_URL = new InjectionToken<string>('AUTH_API_URL')
export const CONTEXT_USER_ID = new InjectionToken<string>('CONTEXT_USER_ID')
export const CONTEXT_USER_ROLE = new InjectionToken<string>('CONTEXT_USER_ROLE')
export const ACCESS_TOKEN_KEY = new InjectionToken<string>('ACCESS_TOKEN_KEY')
export const REFRESH_TOKEN_KEY = new InjectionToken<string>('REFRESH_TOKEN_KEY')
