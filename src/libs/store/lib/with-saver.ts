import { effect, inject } from '@angular/core'
import { getState, signalStoreFeature, withHooks } from '@ngrx/signals'
import { omit } from 'radash'
import { LocalStorageService } from '../../common-service/lib/local-storage.service'

export function withSaver(name: string, exclude = []) {
    return signalStoreFeature(
        withHooks({
            onInit(store) {
                const localStorageService = inject(LocalStorageService)
                effect(() => {
                    const state = omit(getState(store), exclude)
                    localStorageService.setItem(name, JSON.stringify(state))
                })
            },
        }),
    )
}
