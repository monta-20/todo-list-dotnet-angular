import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/Auth/auth-service';
import { ToastService } from '../../../core/services/Toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  menuOpen: boolean = false;
  username: string = '';
  isAdmin = false;
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    // S'abonner au user courant pour mise à jour automatique
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.username = user.name;
        this.isAdmin = user.role === 'Admin';
        this.isLoggedIn = true;
      } else {
        this.username = '';
        this.isAdmin = false;
        this.isLoggedIn = false;
      }
    });
  }

  showUsers() {
    this.router.navigate(['/todo/users']);
  }

  logout() {
    this.authService.clearToken();
    this.toast.show('Déconnexion réussie', 'info', 3000);
    this.router.navigate(['/todo/login']);
  }
}
