import {
    Component,
    Host,
    Input,
    inject,
    Optional,
    SkipSelf,
} from '@angular/core'
import {
    ControlContainer,
    FormGroupDirective,
    ReactiveFormsModule,
} from '@angular/forms'
import { FloatLabelModule } from 'primeng/floatlabel'
import { InputTextModule } from 'primeng/inputtext'
import { FormValidationErrorsService } from '../../../common-service/lib/form-validation-errors.service'
import { InputType } from './types'

@Component({
    standalone: true,
    selector: 'common-form-input',
    imports: [FloatLabelModule, InputTextModule, ReactiveFormsModule],
    templateUrl: './form-input.component.html',
    styleUrl: './form-input.component.css',
})
export class FormInputComponent {
    @Input() label!: string
    @Input() controlName!: string
    @Input() placeHolder?: string = ''
    @Input() type: InputType = 'text'

    private container = inject(ControlContainer)
    private formError = inject(FormValidationErrorsService)

    constructor(
        @Optional()
        @Host()
        @SkipSelf()
        public controlContainer: ControlContainer,
    ) {}

    get form() {
        return (this.container as FormGroupDirective).form
    }

    get getError() {
        return (this.container as FormGroupDirective).getError
    }

    get control() {
        return this.form.get(this.controlName)
    }

    controls(control: string) {
        return this.form.get(control)
    }

    get getErrorMsg(): string | null {
        return (
            this.formError?.getErrorMsg(this.controls(this.controlName)) ?? null
        )
    }
}
