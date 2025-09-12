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
    // Vérifie si l'utilisateur est connecté au chargement
    this.isLoggedIn = !!this.authService.getToken();

    // mise à jour automatique avec BehaviorSubject
    this.authService.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.username = user.name;
        this.isAdmin = user.role === 'Admin';
        this.isLoggedIn = true;
      },
      error: () => {
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
