import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { ToDoList } from '../../core/services/to-do-list/to-do-list';

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

  constructor(private userService: ToDoList) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers(this.search, this.filterRole, this.sortBy, this.descending, this.page, this.pageSize)
      .subscribe({
        next: res => {
          this.users = res.items;
          this.applyFilters();  // si tu veux filtrer encore côté client
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

    let startPage = Math.max(1, this.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    // Ajuster si on est près de la fin
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }


}
