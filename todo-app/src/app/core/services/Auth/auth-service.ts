import { Injectable } from '@angular/core';
import { AuthRequest, AuthResponse } from '../../../models/Auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.ApiUrl}/auth`;

  private loggedIn = new BehaviorSubject<boolean>(!!this.getToken());
  loggedIn$ = this.loggedIn.asObservable();

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  // SIGN IN
  signIn(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, request).pipe(
      tap(user => {
        this.setToken(user.token!);
        this.currentUserSubject.next(user);
      })
    );
  }

  // SIGN UP
  signUp(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, request).pipe(
      tap(user => {
        this.setToken(user.token!);
        this.currentUserSubject.next(user);
      })
    );
  }

  // GOOGLE LOGIN
  googleLogin(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google`, request).pipe(
      tap(user => {
        this.setToken(user.token!);
        this.currentUserSubject.next(user);
      })
    );
  }

  // GET CURRENT USER
  getCurrentUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  setToken(token: string) {
    localStorage.setItem('jwt', token);
    this.loggedIn.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  clearToken() {
    localStorage.removeItem('jwt');
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
  }

  blockUser(id: string | number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/block`, {});
  }

  unblockUser(id: string | number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/unblock`, {});
  }
}


