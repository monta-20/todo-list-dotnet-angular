import { Injectable } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];

  show(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration = 3000
  ) {
    const toast: Toast = { message, type, duration };
    this.toasts.push(toast);

    // Supprimer automatiquement
    setTimeout(() => this.remove(toast), duration);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
  success(msg: string, duration = 3000) {
    this.show(msg, 'success', duration);
  }

  error(msg: string, duration = 3000) {
    this.show(msg, 'error', duration);
  }

  info(msg: string, duration = 3000) {
    this.show(msg, 'info', duration);
  }

  warning(msg: string, duration = 3000) {
    this.show(msg, 'warning', duration);
  }
}
