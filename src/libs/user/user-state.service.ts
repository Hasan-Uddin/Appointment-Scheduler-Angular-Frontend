import { Injectable, inject } from '@angular/core'
import {
    catchError,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    finalize,
    switchMap,
    tap,
    throwError,
} from 'rxjs'
import { SimpleStore } from '../store'
import { User } from './user.model'
import { UserApiService } from './user-api.service'

export type userState = {
    users: User[]
    selectedUsers: User[]
    loading: boolean
    error: boolean
    selectedId: string
    search?: string
    page?: number
    size?: number
    orderBy?: string
}

const initialUserState: userState = {
    users: [],
    selectedUsers: [],
    loading: false,
    error: false,
    selectedId: '',
    search: '',
    page: 1,
    size: 10,
    orderBy: 'title',
}

@Injectable()
export class UserListStateService extends SimpleStore<userState> {
    // private initialized = signal(false)
    userApiService = inject(UserApiService)

    constructor() {
        super(initialUserState)
    }

    init() {
        // if (this.initialized()) return
        this.continueLoadingUser()
        // this.initialized.set(true)
    }

    private continueLoadingUser() {
        combineLatest([
            this.select('search'),
            this.select('selectedId'),
            this.select('selectedId'),
            this.select('selectedId'),
        ])
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => this.setState({ loading: true })),
                switchMap(([search, selectedId]) => {
                    return this.userApiService.findAllUsers({
                        search,
                        selectedId,
                        page: 1,
                        size: 20,
                    })
                }),
            )
            .subscribe({
                next: (res) => {
                    console.log('LOG data', res)
                    this.setState({
                        loading: false,
                        users: res,
                    })
                },
                error: () => {
                    this.setState({ loading: false, error: true })
                },
            })
    }

    deleteUser(id: string) {
        this.setState({ loading: true })
        return this.userApiService.delete(id).pipe(
            tap(() => {
                this.removeUserFromState(id)
            }),
            catchError((error) => {
                console.error('Error deleting user:', error)
                this.setState({ error: true })
                return throwError(() => new Error('Failed to delete User'))
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    replaceUser(data: User) {
        console.log('LOG state User', data)
        const { users } = this.getState()
        this.setState({
            users: users.map((c) => (c.id === data.id ? data : c)),
        })
    }

    updateUser(id: any, data: User) {
        const { users } = this.getState()
        this.setState({ loading: true })
        const currentUser = users.find((u) => u.id === id)
        const mergedUser: User = { ...currentUser, ...data }

        return this.userApiService.update(id, data).pipe(
            tap((role) => this.replaceUser(mergedUser)),
            catchError((error) => {
                console.error('Error updating user:', error) // Log actual error
                this.setState({ error: true })
                return throwError(() => new Error('Failed to update'))
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    pushUser(User: User) {
        this.setState({
            users: [User, ...this.getState().users],
        })
    }

    private removeUserFromState(id: string) {
        const updatedUsers = this.getState().users.filter(
            (User) => User.id !== id,
        )
        this.setState({ users: updatedUsers })
    }

    private updatedUserState(
        id: string,
        updatedUser: User,
        currentUsers: User[],
    ) {
        this.setState({
            users: [...currentUsers.filter((c) => c.id !== id), updatedUser],
        })
    }

    setSelectedUsers(users: User[]) {
        this.setState({ selectedUsers: [...users] })
    }

    resetSelectedUsers() {
        this.setState({ selectedUsers: [] })
    }
}
