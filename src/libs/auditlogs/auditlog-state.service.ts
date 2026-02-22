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
import { AuditLog, AuditLogApiService } from '.'

export type AuditLogState = {
    auditLogs: AuditLog[]
    selectedAuditLogs: AuditLog[]
    loading: boolean
    error: boolean
    selectedId: string
    search?: string
    page?: number
    size?: number
    orderBy?: string
}

const initialAuditLogState: AuditLogState = {
    auditLogs: [],
    selectedAuditLogs: [],
    loading: false,
    error: false,
    selectedId: '',
    search: '',
    page: 1,
    size: 10,
    orderBy: 'title',
}

@Injectable()
export class AuditLogListStateService extends SimpleStore<AuditLogState> {
    // private initialized = signal(false)
    AuditLogApiService = inject(AuditLogApiService)

    constructor() {
        super(initialAuditLogState)
    }

    init() {
        // if (this.initialized()) return
        this.continueLoadingAuditLog()
        // this.initialized.set(true)
    }

    private continueLoadingAuditLog() {
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
                    return this.AuditLogApiService.findAllAuditLogs({
                        search,
                        selectedId,
                        page: 1,
                        size: 20,
                    })
                }),
            )
            .subscribe({
                next: (res) => {
                    // console.log('LOG data', res)
                    this.setState({
                        loading: false,
                        auditLogs: res,
                    })
                },
                error: () => {
                    this.setState({ loading: false, error: true })
                },
            })
    }

    deleteAuditLog(id: string) {
        this.setState({ loading: true })
        return this.AuditLogApiService.delete(id).pipe(
            tap(() => {
                this.removeAuditLogFromState(id)
            }),
            catchError((error) => {
                console.error('Error deleting AuditLog:', error)
                this.setState({ error: true })
                return throwError(() => new Error('Failed to delete AuditLog'))
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    private removeAuditLogFromState(id: string) {
        const updatedAuditLogs = this.getState().auditLogs.filter(
            (auditLog) => auditLog.id !== id,
        )
        this.setState({ auditLogs: updatedAuditLogs })
    }

    setSelectedAuditLogs(auditLogs: AuditLog[]) {
        this.setState({ selectedAuditLogs: [...auditLogs] })
    }

    resetSelectedAuditLogs() {
        this.setState({ selectedAuditLogs: [] })
    }
}
