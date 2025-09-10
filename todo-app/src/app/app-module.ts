import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { TodoContainerComponent } from './features/todo-container-component/todo-container-component';
import { TodoListComponent } from './features/todo-list-component/todo-list-component';
import { TodoFormComponent } from './features/todo-form-component/todo-form-component';
import { TodoFilterComponent } from './features/todo-filter-component/todo-filter-component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignIn } from './features/sign-in/sign-in';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, HttpClientModule, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../app/core/interceptor/auth-interceptor';
import { SignUp } from './features/sign-up/sign-up';
import { ToastContainerComponent } from './features/toast-container-component/toast-container-component';
import { Navbar } from './features/layout/navbar/navbar';


@NgModule({
  declarations: [
    App,
    TodoContainerComponent,
    TodoListComponent,
    TodoFormComponent,
    TodoFilterComponent,
    SignIn,
    SignUp,
    ToastContainerComponent,
    Navbar
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ],
  
  bootstrap: [App]
})
export class AppModule { }
