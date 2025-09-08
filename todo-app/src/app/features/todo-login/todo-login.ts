import { Component } from '@angular/core';
import { Auth2 } from '../../core/services/Auth/Auth2.0/auth2';

@Component({
  selector: 'app-todo-login',
  standalone: false,
  templateUrl: './todo-login.html',
  styleUrl: './todo-login.css'
})
export class TodoLogin {
  user: any = null;

  constructor(private authService: Auth2) { }

  login() {
    this.authService.loginWithGoogle();
  }

  getUser() {
    this.authService.getCurrentUser().subscribe({
      next: (res) => this.user = res,
      error: () => this.user = null
    });
  }
}
