import { Injectable, inject } from '@angular/core'
import { WA_WINDOW } from '@ng-web-apis/common'
import { CONTEXT_USER_ID, CONTEXT_USER_ROLE } from '../injector/auth-injector'
import { UserInfo } from './user-info.model'

@Injectable({
    providedIn: 'root',
})
export class ContextUserStorageService {
    private windowRef = inject(WA_WINDOW)
    private contextUserId = inject<string>(CONTEXT_USER_ID)
    private contextUserRole = inject<string>(CONTEXT_USER_ROLE)
    private readonly STORAGE_KEY = 'app_user_info'

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

    saveUserInfo(user: UserInfo): void {
        const existing = this.getUserInfo()
        if (existing && existing.email === user.email) return
        this.windowRef.localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(user),
        )
    }

    getUserInfo(): UserInfo | null {
        const raw = this.windowRef.localStorage.getItem(this.STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
    }

    getEmail(): string | null {
        const user = this.getUserInfo()
        return user?.email ?? null
    }
}
