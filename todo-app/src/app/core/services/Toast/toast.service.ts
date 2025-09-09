import { Injectable } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000) {
    const toast: Toast = { message, type };
    this.toasts.push(toast);

    // Supprimer automatiquement après `duration` ms
    setTimeout(() => {
      this.remove(toast);
    }, duration);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
