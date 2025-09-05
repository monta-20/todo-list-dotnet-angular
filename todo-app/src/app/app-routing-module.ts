import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoContainerComponent } from './features/todo-container-component/todo-container-component';
import { TodoFormComponent } from './features/todo-form-component/todo-form-component';

const routes: Routes = [
  { path: 'todo', component: TodoContainerComponent },
  { path: 'todo/add', component: TodoFormComponent },
  { path: 'todo/edit/:id', component: TodoFormComponent },
  { path: '', redirectTo: 'todo', pathMatch:'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
