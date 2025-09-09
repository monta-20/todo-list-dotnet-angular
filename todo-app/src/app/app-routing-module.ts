import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoContainerComponent } from './features/todo-container-component/todo-container-component';
import { TodoFormComponent } from './features/todo-form-component/todo-form-component';
import { SignIn } from './features/sign-in/sign-in';
import { SignUp } from './features/sign-up/sign-up';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

const routes: Routes = [
  { path: 'todo', component: TodoContainerComponent, canActivate: [authGuard] },
  { path: 'todo/add', component: TodoFormComponent, canActivate: [authGuard] },
  { path: 'todo/edit/:id', component: TodoFormComponent, canActivate: [authGuard] },
  { path: 'todo/login', component: SignIn, canActivate: [noAuthGuard] },
  { path: 'todo/signup', component: SignUp, canActivate: [noAuthGuard] },
  { path: '**', redirectTo: 'todo/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
