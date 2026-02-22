import { Injectable, inject, signal } from '@angular/core'

import {
    catchError,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    finalize,
    of,
    switchMap,
    tap,
    throwError,
} from 'rxjs'
import { SimpleStore } from '../store'
import { Todo } from './todo.model'
import { TodoApiService } from './todo-api.service'

export type todoState = {
    todos: Todo[]
    loading: boolean
    error: boolean
    selectedId: string
    search?: string
    page?: number
    size?: number
    orderBy?: string
}

const initialTodoState: todoState = {
    todos: [],
    loading: false,
    error: false,
    selectedId: '',
    search: '',
    page: 1,
    size: 10,
    orderBy: 'title',
}

@Injectable()
export class TodoListStateService extends SimpleStore<todoState> {
    // private initialized = signal(false)
    private todoApiService = inject(TodoApiService)

    constructor() {
        super(initialTodoState)
    }

    init() {
        // if (this.initialized()) return
        this.continueLoadingTodo()
        // this.initialized.set(true)
    }

    private continueLoadingTodo() {
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
                    return this.todoApiService.findAllTodos({
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
                        todos: res,
                    })
                },
                error: () => {
                    this.setState({ loading: false, error: true })
                },
            })
    }

    deleteTodo(id: string) {
        this.setState({ loading: true })
        return this.todoApiService.delete(id).pipe(
            catchError(() => {
                this.setState({ error: true })
                return throwError(() => new Error('Failed to delete todo'))
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    replaceTodo(data: Todo) {
        console.log('LOG state todo', data)
        const { todos } = this.getState()
        this.setState({
            todos: todos.map((c) => (c.id === data.id ? data : c)),
        })
    }

    updateTodo(id: any, data: Todo) {
        const { todos } = this.getState()
        this.setState({ loading: true })

        return this.todoApiService.update(id, data).pipe(
            tap((value) => {
                if (value.data) {
                    this.updatedTodoState(id, value.data, todos)
                }
            }),
            catchError(() => {
                this.setState({ error: true })
                return throwError(
                    () => new Error('Failed to update news ticker'),
                )
            }),
            finalize(() => this.setState({ loading: false })),
        )
    }

    pushTodo(todo: Todo) {
        this.setState({
            todos: [todo, ...this.getState().todos],
        })
    }

    private removeTodoFromState(id: number) {
        const updatedTodos = this.getState().todos.filter(
            (todo) => todo.id !== id,
        )
        this.setState({ todos: updatedTodos })
    }

    private updatedTodoState(
        id: number,
        updatedTodo: Todo,
        currentTodos: Todo[],
    ) {
        this.setState({
            todos: [...currentTodos.filter((c) => c.id !== id), updatedTodo],
        })
    }
}
