import { Injectable, inject } from '@angular/core'
import { catchError, EMPTY, finalize, tap, throwError } from 'rxjs'
import { ContextUserStorageService } from '../auth/service/contextUser-storage.service' // adjust path
import { AlertService } from '../common-service/lib/alert.service'
import { SimpleStore } from '../store'
import { UserProfile } from './user-profile.model'
import { UserProfileApiService } from './user-profile-api.service'

export type UserProfileState = {
    userProfile: UserProfile | null
    loading: boolean
    error: boolean
    loaded: boolean
    userId: string | null
}

const initialUserProfileState: UserProfileState = {
    userProfile: null,
    loading: false,
    error: false,
    loaded: false,
    userId: null,
}

@Injectable()
export class UserProfileStateService extends SimpleStore<UserProfileState> {
    private userProfileApiService = inject(UserProfileApiService)
    private alertService = inject(AlertService)
    private contextUserStorage = inject(ContextUserStorageService)

    constructor() {
        super(initialUserProfileState)
    }

    /**
     * Initialize and load the profile for the current user.
     * Will only refetch if:
     *  - it's not yet loaded, or
     *  - you pass force = true, or
     *  - the id changed. ;)
     */
    init(force = false) {
        const userId = this.contextUserStorage.getContextUserId()
        if (!userId) {
            console.error('No user ID in context storage')
            this.setState({ error: true })
            return
        }

        const { loaded, userId: currentId } = this.getState()

        if (loaded && !force && currentId === userId) {
            return
        }

        this.setState({ userId })
        this.loadUserProfile(userId)
    }

    private loadUserProfile(userId: string) {
        this.setState({ loading: true, error: false })

        this.userProfileApiService
            .getUserProfileById(userId)
            .pipe(
                tap((res: any) => {
                    console.log('LOG user profile data:', res)
                    this.setState({
                        userProfile: res,
                        loading: false,
                        loaded: true,
                        userId,
                    })
                }),
                catchError((error: any) => {
                    console.error('Error loading UserProfile:', error)
                    this.setState({
                        loading: false,
                        error: true,
                        loaded: false,
                    })
                    return EMPTY
                }),
            )
            .subscribe()
    }

    deleteUserProfile() {
        const current = this.getState().userProfile
        if (!current) {
            return throwError(() => new Error('No user profile loaded'))
        }

        this.setState({ loading: true, error: false })

        return this.userProfileApiService.delete(current.id).pipe(
            tap(() => {
                this.setState({
                    userProfile: null,
                    loaded: false,
                    userId: null,
                })
                this.alertService.success('User profile deleted successfully')
            }),
            catchError((error: any) => {
                console.error('Error deleting UserProfile:', error)
                this.setState({ error: true })
                this.alertService.error('Failed to delete user profile')
                return throwError(
                    () => new Error('Failed to delete UserProfile'),
                )
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    replaceUserProfile(data: UserProfile) {
        this.setState({
            userProfile: data,
            loaded: true,
            userId: data.id ?? this.contextUserStorage.getContextUserId(),
        })
    }

    /// Update current user's profile without passing id from component.

    updateUserProfile(data: UserProfile) {
        const { userId } = this.getState()
        if (!userId) {
            return throwError(() => new Error('No user ID in state'))
        }

        this.setState({ loading: true, error: false })

        return this.userProfileApiService.update(userId, data).pipe(
            tap((response: any) => {
                // response has  { data: UserProfile }
                //const updated: UserProfile = response?.data ?? response
                this.replaceUserProfile(data)
            }),
            catchError((error: any) => {
                console.error('Error updating UserProfile:', error)
                this.setState({ error: true })
                return throwError(() => new Error('Failed to update'))
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    pushUserProfile(userProfile: UserProfile) {
        this.setState({
            userProfile,
            loaded: true,
            userId: userProfile.id,
        })
    }
}
