import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignIn } from './features/sign-in/sign-in';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, HttpClientModule, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../app/core/interceptor/auth-interceptor';
import { SignUp } from './features/sign-up/sign-up';
import { ToastContainerComponent } from './features/toast-container-component/toast-container-component';
import { Navbar } from './features/layout/navbar/navbar';
import { TodoList } from './features/todo-list/todo-list';
import { TodoCreate } from './features/todo-create/todo-create';
import { TodoEdit } from './features/todo-edit/todo-edit';
import { ConfirmContainerComponent } from './features/confirm-container-component/confirm-container-component';
import { UserList } from './features/user-list/user-list';


@NgModule({
  declarations: [
    App,
    SignIn,
    SignUp,
    ToastContainerComponent,
    Navbar,
    TodoList,
    TodoCreate,
    TodoEdit,
    ConfirmContainerComponent,
    UserList
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
