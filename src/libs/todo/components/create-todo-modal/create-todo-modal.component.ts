import { CommonModule } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { AlertService } from '../../../common-service/lib/alert.service'
import { TodoFormService } from '../../todo.form.service'
import { Todo, TodoDto } from '../../todo.model'
import { TodoApiService } from '../../todo-api.service'
import { TodoListStateService } from '../../todo-list-state.service'

@Component({
    selector: 'app-create-todo-modal',
    imports: [CommonModule, ButtonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './create-todo-modal.component.html',
    styleUrl: './create-todo-modal.component.css',
    providers: [TodoListStateService],
})
export class CreateTodoModalComponent {
    protected todoFormService = inject(TodoFormService)
    private todoApiService = inject(TodoApiService)
    private todoListSateService = inject(TodoListStateService)
    private alertService = inject(AlertService)
    private ref = inject(DynamicDialogRef)

    isLoading = signal<boolean>(false)
    isError = signal<boolean>(false)

    submit(event: Event) {
        this.isLoading.set(true)
        event?.preventDefault
        const formValue = this.todoFormService.getValue()

        const todoData: TodoDto = {
            userId: formValue.userId ?? '',
            title: formValue.title,
            body: formValue.body,
        }
        this.createTodo(todoData)
    }

    createTodo(todo: TodoDto) {
        this.todoApiService.crateNewTodo(todo).subscribe({
            next: (res) => {
                this.todoFormService.form.reset()
                this.isLoading.set(false)
                this.ref.close(res)
                this.alertService.success('Todo created successfully')
            },
            error: () => {
                this.isLoading.set(false)
                this.isError.set(true)
                this.alertService.error('Failed to create todo')
            },
        })
    }
}
