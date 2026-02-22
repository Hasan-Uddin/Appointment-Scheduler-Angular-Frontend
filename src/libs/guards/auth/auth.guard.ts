import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { catchError, map, of } from 'rxjs'
import { AuthService } from '../../auth/service/auth.service'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoginModalComponent } from '../../auth/Components/login-modal/login-modal.component';

let loginDialogRef: DynamicDialogRef | null = null;

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const dialogService = inject(DialogService);

  return auth.isLoggedIn().pipe(
    map(isLogged => {
      if (isLogged) return true;

      if (!loginDialogRef) {
        loginDialogRef = dialogService.open(LoginModalComponent, {
          header: 'Login Required',
          width: '400px',
          modal: true,
          closable: false,
          dismissableMask: false
        });

        loginDialogRef?.onClose.subscribe(() => {
          loginDialogRef = null;
        });
      }

      return false;
    })
  );
};