import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TodoContainerComponent } from './features/todo-container-component/todo-container-component';
import { TodoListComponent } from './features/todo-list-component/todo-list-component';
import { TodoFormComponent } from './features/todo-form-component/todo-form-component';
import { TodoFilterComponent } from './features/todo-filter-component/todo-filter-component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TodoLogin } from './features/todo-login/todo-login';

@NgModule({
  declarations: [
    App,
    TodoContainerComponent,
    TodoListComponent,
    TodoFormComponent,
    TodoFilterComponent,
    TodoLogin
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
