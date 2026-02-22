import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { MfaLog } from './mfalog.model'

@Injectable({
    providedIn: 'root',
})
export class MfaLogStateService {
    private logsSubject = new BehaviorSubject<MfaLog[]>([])
    logs$: Observable<MfaLog[]> = this.logsSubject.asObservable()

    constructor() {}

    setLogs(logs: MfaLog[]) {
        this.logsSubject.next(logs)
    }

    addLog(log: MfaLog) {
        const current = this.logsSubject.getValue()
        this.logsSubject.next([...current, log])
    }

    updateLog(updatedLog: MfaLog) {
        const current = this.logsSubject.getValue()
        this.logsSubject.next(
            current.map((l) => (l.id === updatedLog.id ? updatedLog : l)),
        )
    }

    deleteLog(id: number) {
        const current = this.logsSubject.getValue()
        this.logsSubject.next(current.filter((l) => l.id !== id))
    }
}
