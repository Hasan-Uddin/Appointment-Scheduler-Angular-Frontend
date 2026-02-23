import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { TodoListStateService } from '../../todo-list-state.service'
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'

@Component({
    selector: 'app-todo-table',
    imports: [CommonModule, ButtonModule, TableModule],
    templateUrl: './todo-table.component.html',
    styleUrl: './todo-table.component.css',
})
export class TodoTableComponent {
    protected todoListStateService = inject(TodoListStateService)

    editTodo(todo: any) {
        this.todoListStateService.updateTodo(todo.id, todo)
    }

    confirmDelete(todo: any) {
        this.todoListStateService.deleteTodo(todo.id)
    }
}
