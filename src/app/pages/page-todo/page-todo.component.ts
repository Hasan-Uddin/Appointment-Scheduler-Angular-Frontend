import { Component, inject, OnInit } from '@angular/core'
import { ButtonModule } from 'primeng/button'
import { DialogService } from 'primeng/dynamicdialog'
import {
    CreateTodoModalComponent,
    TodoListStateService,
    TodoTableComponent,
} from '../../../libs/todo'

@Component({
    selector: 'app-page-todo',
    imports: [TodoTableComponent, ButtonModule],
    templateUrl: './page-todo.component.html',
    styleUrl: './page-todo.component.css',
    providers: [TodoListStateService],
})
export class PageTodoComponent implements OnInit {
    private todoListStateService = inject(TodoListStateService)
    private dialogService = inject(DialogService)

    ngOnInit(): void {
        this.todoListStateService.init()
    }

    addTodo() {
        const ref = this.dialogService.open(CreateTodoModalComponent, {
            header: 'Add Todo',
            width: '50%',
            closable: true,
        })

        ref?.onClose.subscribe((todo) => {
            if (todo) {
                this.todoListStateService.pushTodo(todo)
            }
        })
    }
}
