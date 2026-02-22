import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AuditLogTableComponent } from './auditlog-table.component'

describe('UserTableComponent', () => {
    let component: AuditLogTableComponent
    let fixture: ComponentFixture<AuditLogTableComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AuditLogTableComponent],
        }).compileComponents()

        fixture = TestBed.createComponent(AuditLogTableComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
