import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { TodoListStateService } from '../../todo-list-state.service'

@Component({
    selector: 'app-todo-table',
    imports: [CommonModule],
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
