import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { MfaSetting } from './mfasetting.model'
import { MfaSettingDataService } from './mfasetting-data.service'

@Injectable({
    providedIn: 'root',
})
export class MfaSettingStateService {
    private settingsSubject = new BehaviorSubject<MfaSetting[]>([])
    mfaSettings$ = this.settingsSubject.asObservable()

    constructor(private dataService: MfaSettingDataService) {}

    loadSettings() {
        this.dataService
            .getAll()
            .subscribe((data) => this.settingsSubject.next(data))
    }

    toggleEnabled(user_name: string) {
        if (this.dataService.toggleEnabled(user_name)) {
            this.loadSettings()
        }
    }
}
