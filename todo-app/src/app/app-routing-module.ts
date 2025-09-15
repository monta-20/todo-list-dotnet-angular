import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignIn } from './features/sign-in/sign-in';
import { SignUp } from './features/sign-up/sign-up';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';
import { TodoList } from './features/todo-list/todo-list';
import { TodoCreate } from './features/todo-create/todo-create';
import { TodoEdit } from './features/todo-edit/todo-edit';
import { UserList } from './features/user-list/user-list';

const routes: Routes = [
  { path: 'todo', component: TodoList, canActivate: [authGuard] }, 
  { path: 'todo/create', component: TodoCreate, canActivate: [authGuard] },
  { path: 'todo/edit/:id', component: TodoEdit, canActivate: [authGuard] },
  { path: 'todo/login', component: SignIn, canActivate: [noAuthGuard] },
  { path: 'todo/signup', component: SignUp, canActivate: [noAuthGuard] },
  { path: 'todo/users', component: UserList, canActivate: [authGuard], data: { role: 'Admin' } },
  { path: '**', redirectTo: 'todo/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
