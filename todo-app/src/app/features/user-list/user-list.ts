import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { ToDoList } from '../../core/services/to-do-list/to-do-list';
import { ConfirmService } from '../../core/services/Confirm/confirm.service';
import { AuthService } from '../../core/services/Auth/auth-service';
import { ToastService } from '../../core/services/Toast/toast.service';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.html',
  styleUrl: './user-list.css'
})
export class UserList implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];

  // Filtrage et recherche
  search: string = '';
  filterRole: string = '';

  // Pagination
  page: number = 1;
  pageSize: number = 3;
  totalItems: number = 0;
  totalPages: number = 0;

  // Tri
  sortBy: string = 'name';
  descending: boolean = false;
  loading: boolean = false;

  constructor(private userService: ToDoList, private confirmService: ConfirmService, private authService: AuthService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers(this.search, this.filterRole, this.sortBy, this.descending, this.page, this.pageSize)
      .subscribe({
        next: res => {
          this.users = res.items;
          this.applyFilters(); 
          this.totalItems = res.total;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  async toggleBlock(user: User) {
   
    if (user.role === 'Admin' && !user.isBlocked) {
      this.toastService.warning("Impossible de bloquer un administrateur !");
      return;
    }

    const action = user.isBlocked ? 'Débloquer' : 'Bloquer';

    const confirmed = await this.confirmService.confirm({
      title: `${action} utilisateur`,
      message: `Voulez-vous vraiment ${action.toLowerCase()} ${user.name}?`
    });

    if (!confirmed) return;

    if (user.isBlocked) {
      // Débloquer
      this.authService.unblockUser(user.id).subscribe(() => {
        this.toastService.show(`${user.name} est débloqué !`);
        user.isBlocked = false;  
      });
    } else {
      // Bloquer
      this.authService.blockUser(user.id).subscribe(() => {
        this.toastService.show(`${user.name} est bloqué !`);
        user.isBlocked = true;    
      });
    }
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.search ||
        user.name.toLowerCase().includes(this.search.toLowerCase()) ||
        user.email.toLowerCase().includes(this.search.toLowerCase());

      const matchesRole = !this.filterRole ||
        (user.role && user.role.toLowerCase() === this.filterRole.toLowerCase());

      return matchesSearch && matchesRole;
    });

    this.applySort();

    this.totalItems = this.filteredUsers.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);

    // Réinitialiser la page actuelle si nécessaire
    if (this.page > this.totalPages) this.page = this.totalPages || 1;
  }


  sort(field: string) {
    if (this.sortBy === field) {
      this.descending = !this.descending;
    } else {
      this.sortBy = field;
      this.descending = false;
    }
    this.applySort();
  }

  onSearch() {
    this.page = 1;
    this.loadUsers();
  }
  applySort() {
    this.filteredUsers.sort((a, b) => {
      let valueA = a[this.sortBy as keyof User];
      let valueB = b[this.sortBy as keyof User];

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = (valueB as string).toLowerCase();
      }

      if (valueA < valueB) {
        return this.descending ? 1 : -1;
      }
      if (valueA > valueB) {
        return this.descending ? -1 : 1;
      }
      return 0;
    });
  }

  changePage(direction: number) {
    const newPage = this.page + direction;
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.loadUsers(); // recharge le serveur pour la page correcte
  }

  goToPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.totalPages) return;
    this.page = pageNumber;
    this.loadUsers();
  }


  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Si le total est inférieur ou égal à maxVisiblePages, on affiche tout
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.page - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;

      if (endPage > this.totalPages) {
        endPage = this.totalPages;
        startPage = endPage - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

}
