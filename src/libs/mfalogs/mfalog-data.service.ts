import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { MfaLog } from './mfalog.model'

@Injectable({
    providedIn: 'root',
})
export class MfaLogsDataService {
    private logs: MfaLog[] = [
        {
            id: 1,
            user_name: 'Arman',
            login_time: '2025-11-20 08:30',
            ip_address: '192.168.1.10',
            device: 'Chrome on Windows',
            status: 'success',
        },
        {
            id: 2,
            user_name: 'Hasan',
            login_time: '2025-11-20 09:15',
            ip_address: '192.168.1.11',
            device: 'Firefox on MacOS',
            status: 'failed',
        },
        {
            id: 3,
            user_name: 'Rahim',
            login_time: '2025-11-21 11:00',
            ip_address: '192.168.1.12',
            device: 'Edge on Windows',
            status: 'success',
        },
    ]

    constructor() {}

    getAll(): Observable<MfaLog[]> {
        return of(this.logs)
    }

    create(log: MfaLog): Observable<MfaLog> {
        const newId = this.logs.length
            ? Math.max(...this.logs.map((l) => l.id)) + 1
            : 1
        log.id = newId
        this.logs.push(log)
        return of(log)
    }

    update(id: number, log: MfaLog): Observable<MfaLog> {
        const index = this.logs.findIndex((l) => l.id === id)
        if (index !== -1) this.logs[index] = log
        return of(log)
    }

    delete(id: number): Observable<void> {
        this.logs = this.logs.filter((l) => l.id !== id)
        return of(undefined)
    }
}
