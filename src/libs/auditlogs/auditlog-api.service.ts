import { HttpClient, HttpParams } from '@angular/common/http'
import { Inject, Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiService } from '../common-service/lib/api.service'
import { ENVIRONMENT, EnvironmentConfig } from '../core'
import { AuditLog, AuditLogDto } from './auditlog.model'

@Injectable({
    providedIn: 'root',
})
export class AuditLogApiService extends ApiService<AuditLog, AuditLogDto> {
    constructor(
        @Inject(ENVIRONMENT)
        private env: EnvironmentConfig,
    ) {
        super(inject(HttpClient), `${env.apiUrl}/audit-logs`)
    }

    findAllAuditLogs(query: {
        status?: string
        search?: string
        selectedId?: string
        page?: number
        size?: number
    }): Observable<AuditLog[]> {
        let params = new HttpParams()
        if (query.search) {
            params = params.set('search', query.search)
        }
        if (query.status) {
            params = params.set('selectedId', query.status)
        }
        if (query.page) {
            params = params.set('page', query.page)
        }
        if (query.size) {
            params = params.set('page', query.size)
        }
        return this.http.get<AuditLog[]>(this.apiUrl)
    }

    createNew(AuditLog: AuditLogDto): Observable<AuditLog> {
        return this.http.post<AuditLog>(this.apiUrl, AuditLog)
    }
}
