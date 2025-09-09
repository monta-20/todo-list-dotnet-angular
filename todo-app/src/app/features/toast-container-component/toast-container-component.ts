import { Component } from '@angular/core';
import { ToastService } from '../../core/services/Toast/toast.service';

@Component({
  selector: 'app-toast-container-component',
  standalone: false,
  templateUrl: './toast-container-component.html',
  styleUrl: './toast-container-component.css'
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) { }

  removeToast(toast: any) {
    this.toastService.remove(toast);
  }
}
