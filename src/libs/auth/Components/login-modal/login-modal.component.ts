import { Component, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent implements OnDestroy {
  private ref = inject(DynamicDialogRef);
  private authWindow: Window | null = null;
  private pollTimer: number | null = null;
  
  isLoading = false;

  loginWithGoogle() {
    const url = `${environment.apiUrl}/auth/google`;
    
    // Center popup
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    this.authWindow = window.open(
      url,
      'GoogleAuth',
      `width=${width},height=${height},left=${left},top=${top},popup=yes`
    );

    this.isLoading = true;

    // Just wait for popup to close
    this.pollTimer = window.setInterval(() => {
      if (this.authWindow?.closed) {
        this.onPopupClosed();
      }
    }, 500);
  }

  private onPopupClosed() {
    this.cleanup();
    // Backend set the cookie, just close modal and reload
    this.ref.close();
    window.location.reload();
  }

  private cleanup() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.isLoading = false;
  }

  close() {
    this.cleanup();
    this.authWindow?.close();
    this.ref.close();
  }

  ngOnDestroy() {
    this.cleanup();
  }
}