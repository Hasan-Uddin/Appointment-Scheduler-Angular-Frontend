import { Injectable, inject } from '@angular/core'
import { WA_WINDOW } from '@ng-web-apis/common'
import { CONTEXT_USER_ID, CONTEXT_USER_ROLE } from '../injector/auth-injector'

@Injectable({
    providedIn: 'root',
})
export class ContextUserStorageService {
    private windowRef = inject(WA_WINDOW)
    private contextUserId = inject<string>(CONTEXT_USER_ID)
    private contextUserRole = inject<string>(CONTEXT_USER_ROLE)

    clear() {
        this.windowRef.localStorage.removeItem(this.contextUserId)
    }

    saveContextUserId(guid: string): void {
        const saved = this.getContextUserId()
        if (saved === guid) return
        this.windowRef.localStorage.removeItem(this.contextUserId)
        this.windowRef.localStorage.setItem(this.contextUserId, guid)
    }

    saveContextUserRole(roleCode: string): void {
        const saved = this.getContextUserRole()
        if (saved === roleCode) return
        this.windowRef.localStorage.removeItem(this.contextUserRole)
        this.windowRef.localStorage.setItem(this.contextUserRole, roleCode)
    }

    getContextUserId(): string | null {
        return this.windowRef.localStorage.getItem(this.contextUserId)
    }

    getContextUserRole(): string | null {
        return this.windowRef.localStorage.getItem(this.contextUserRole)
    }
}
