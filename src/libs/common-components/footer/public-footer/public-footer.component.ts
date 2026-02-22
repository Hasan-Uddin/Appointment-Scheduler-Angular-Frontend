import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { DATA } from '../../../../assets/data/data'

@Component({
    selector: 'app-public-footer',
    imports: [CommonModule],
    templateUrl: './public-footer.component.html',
    styleUrl: './public-footer.component.css',
})
export class PublicFooterComponent {
    data = DATA
}
