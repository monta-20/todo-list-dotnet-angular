import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoContainerComponent } from './features/todo-container-component/todo-container-component';
import { TodoFormComponent } from './features/todo-form-component/todo-form-component';
import { TodoLogin } from './features/todo-login/todo-login';

const routes: Routes = [
  { path: 'todo', component: TodoContainerComponent },
  { path: 'todo/add', component: TodoFormComponent },
  { path: 'todo/edit/:id', component: TodoFormComponent },
  { path: 'todo/login', component: TodoLogin },
  { path: '', redirectTo: 'todo', pathMatch:'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
