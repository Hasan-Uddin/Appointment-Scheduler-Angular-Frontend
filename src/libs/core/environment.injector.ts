import { InjectionToken } from '@angular/core'
import { EnvironmentConfig } from './environment-config.model'

/**
 * Injection token for the validation app environment
 */
export const ENVIRONMENT = new InjectionToken<EnvironmentConfig>('ENVIRONMENT')
