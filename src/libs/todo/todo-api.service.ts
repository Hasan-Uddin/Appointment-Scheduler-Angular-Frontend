import { HttpClient, HttpParams } from '@angular/common/http'
import { Inject, Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiService } from '../common-service/lib/api.service'
import { ENVIRONMENT, EnvironmentConfig } from '../core'
import { Todo, TodoDto } from './todo.model'

@Injectable({
    providedIn: 'root',
})
export class TodoApiService extends ApiService<Todo, TodoDto> {
    constructor(
        @Inject(ENVIRONMENT)
        private env: EnvironmentConfig,
    ) {
        super(inject(HttpClient), `${env.apiUrl}/posts`)
    }

    findAllTodos(query: {
        status?: string
        search?: string
        selectedId?: string
        page?: number
        size?: number
    }): Observable<Todo[]> {
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
        return this.http.get<Todo[]>(this.apiUrl)
    }

    crateNewTodo(todo: TodoDto): Observable<Todo> {
        return this.http.post<Todo>(this.apiUrl, todo)
    }
    deleteTodo(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`)
    }
}
