// import { Injectable } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { MfaSetting } from './mfasetting.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class MfaSettingsService {

//   private mfaSettings: MfaSetting[] = [
//     {
//       user_name: 'Arman',
//       method: 'TOTP',
//       secret_key: 'JBSWY3DPEHPK3PXP',
//       backup_codes: ['code1', 'code2', 'code3'],
//       enabled: true
//     },
//     {
//       user_name: 'Hasan',
//       method: 'SMS',
//       secret_key: null,
//       backup_codes: null,
//       enabled: true
//     },
//     {
//       user_name: 'Rahim',
//       method: 'EMAIL',
//       secret_key: null,
//       backup_codes: null,
//       enabled: false
//     },
//   ];

//   constructor() {}

//   getAll(): Observable<MfaSetting[]> {
//     return of(this.mfaSettings);
//   }

//   toggleEnabled(user_name: string): boolean {
//     const setting = this.mfaSettings.find(m => m.user_name === user_name);
//     if (setting) {
//       setting.enabled = !setting.enabled;
//       return true;
//     }
//     return false;
//   }
// }

import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { MfaSetting } from './mfasetting.model'

@Injectable({
    providedIn: 'root',
})
export class MfaSettingDataService {
    private mfaSettings: MfaSetting[] = [
        {
            user_name: 'Arman',
            method: 'TOTP',
            secret_key: 'JBSWY3DPEHPK3PXP',
            backup_codes: ['code1', 'code2', 'code3'],
            enabled: true,
        },
        {
            user_name: 'Hasan',
            method: 'SMS',
            secret_key: null,
            backup_codes: null,
            enabled: true,
        },
        {
            user_name: 'Rahim',
            method: 'EMAIL',
            secret_key: null,
            backup_codes: null,
            enabled: false,
        },
    ]

    constructor() {}

    getAll(): Observable<MfaSetting[]> {
        return of(this.mfaSettings)
    }

    toggleEnabled(user_name: string): boolean {
        const setting = this.mfaSettings.find((m) => m.user_name === user_name)
        if (setting) {
            setting.enabled = !setting.enabled
            return true
        }
        return false
    }
}
